import { Component, OnInit, Inject, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsersComponent } from '../users/users.component';
import { RoleComponent } from '../role/role.component';
import { UserService } from '@iverify/core/users/user.service';
import { User } from '@iverify/core/models/user';
import { selectUser } from '@iverify/core/store/selectors/user.selector';
import { ToastType } from '../../toast/toast.component';
import { ToastService } from '../../toast/toast.service';
import { Observable, Subscription } from 'rxjs';
import { DialogComponent } from '../dialog.component';
import { AppState } from '@iverify/core/store/states/app.state';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';

export interface PeriodicElement {
  id: string;
  firstName: number;
  lastName: number;
  email: string;
}

export interface PeriodicElementRoles {
  id: string;
  name: number;
  description: string;
  resource: string[];
}
@Component({
  selector: 'iverify-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  subs: Subscription;
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'action'];
  displayedColumnsRoles: string[] = ['id', 'name', 'description', 'resource', 'action'];
  dataSource: PeriodicElement[];
  dataSourceRoles: PeriodicElementRoles[];
  clickedRows = new Set<PeriodicElement>();
  panelOpenState: boolean = false;
  user$: Observable<User>;
  user: User;

  constructor(
    store: Store<AppState>,
    public dialog: MatDialog,
    private userService: UserService, 
    private toast: ToastService,
    @Inject(ViewContainerRef) private viewContainerRef: ViewContainerRef,
    ) {
      this.subs = new Subscription();
      this.user$ = store.select(selectUser);
      toast.setViewContainerRef(viewContainerRef);
  }

  ngOnInit(): void {
    this.user$.subscribe((result) => {
      this.user = result;
      this.getUserList();
      this.getRolesList();
    });    
  }

  getUserList() {
    this.subs.add(
      this.userService.list().subscribe((results) => {
        this.dataSource = Object.assign(results.data);
        
      })
    );
  }

  getRolesList() {
    this.subs.add(
      this.userService.getRoles().subscribe((results) => {
        this.dataSourceRoles = Object.assign(results.data);
      })
    );
  }

  deleteEntity(type: string, id: number) {
    const confirm = this.dialog.open(DialogComponent, {
      width: '300px'
    });

    confirm.afterClosed().subscribe(result => {
      if (result) {
        if (type === 'user') {
          this.subs.add(
            this.userService.deleteUser(id).subscribe((results) => {
                this.toast.show(ToastType.Danger, 'USER_DELETED');
                this.getUserList();
            })
          );
        }
        if (type === 'role') {
          this.subs.add(
            this.userService.deleteRole(id).subscribe((results) => {
                this.toast.show(ToastType.Danger, 'ROLE_DELETED');
                this.getRolesList();
            })
          );
        }
      } else {
        confirm.close();
      }
    });   
    
  }

  isUserAllowed(permissionType: string, type: string) {
    if (this.user) {
      let role = this.user.roles[0];
      const resources = JSON.parse(role.resource);
      if (!isEmpty(resources)) {
        const roleItem = resources.filter((sect: any) => sect.name === type);
        if (!isEmpty(roleItem)) {
          const val = roleItem[0].permissions.find((item: string) => item === permissionType);
          return (val !== undefined);
        }
      }
    }
    return false;
  }

  openDialog(type: string, element?: any): void {
    let componentSelected: any = (type === 'user') ? UsersComponent : RoleComponent;
    const dialogRef = this.dialog.open(componentSelected, {
      panelClass: 'user-dialog',
      data: {element: element, roles: this.dataSourceRoles},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getUserList();
        this.getRolesList();  
      }
    });
  }
}
