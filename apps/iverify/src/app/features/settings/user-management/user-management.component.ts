import { Component, OnInit, Inject, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersComponent } from '../users/users.component';
import { RoleComponent } from '../role/role.component';
import { UserService } from '@iverify/core/users/user.service';
import { Users, User		} from '@iverify/core/models/user';
import { ToastType } from '../../toast/toast.component';
import { ToastService } from '../../toast/toast.service';
import { Subscription, throwError} from 'rxjs';

export interface PeriodicElement {
  id: string;
  firstName: number;
  lastName: number;
  email: string;
}
@Component({
  selector: 'iverify-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  subs: Subscription;
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email'];
  dataSource: PeriodicElement[];
  clickedRows = new Set<PeriodicElement>();

  constructor(
    public dialog: MatDialog,
    private userService: UserService, 
    private toast: ToastService,
    @Inject(ViewContainerRef) private viewContainerRef: ViewContainerRef,
    ) {
      this.subs = new Subscription();
      toast.setViewContainerRef(viewContainerRef);
  }

  ngOnInit(): void {
    this.getUserList();
  }

  getUserList() {
    this.subs.add(
      this.userService.list().subscribe((results) => {
        this.dataSource = Object.assign(results.data);
      })
    );
  }

  openDialog(type: string): void {
    let componentSelected: any = (type === 'user') ? UsersComponent : RoleComponent;
    const dialogRef = this.dialog.open(componentSelected, {
      panelClass: 'user-dialog',
      data: ''
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getUserList();      
    })
  }
}
