import { Component, OnInit, ViewContainerRef, Inject } from '@angular/core';
import { UserService } from '@iverify/core/users/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastType } from '../../toast/toast.component';
import { ToastService } from '../../toast/toast.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { RoleItem } from '@iverify/core/models/roles';


@Component({
  selector: 'iverify-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  subs: Subscription;
  isEditing: boolean = false;
  userForm: FormGroup;
  showPassword: boolean = false;
  role: RoleItem[];
  rolesList: any[];
  
  constructor(
    private userService: UserService, 
    private toast: ToastService,
    @Inject(ViewContainerRef) private viewContainerRef: ViewContainerRef,
      public dialogRef: MatDialogRef<UsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.subs = new Subscription();
      toast.setViewContainerRef(viewContainerRef);
  }

  getRolesList() {
    this.subs.add(
      this.userService.getRoles().subscribe((results) => {
        this.rolesList = Object.assign(results.data);
      })
    );
  }

   
  ngOnInit(): void {
    this.getRolesList();
    this.userForm = new FormGroup({
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', Validators.required),
        roles: new FormControl('', Validators.required),
        phone: new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
        address: new FormControl('')
    });
    if(this.data && this.data.id > 0) {
      this.userForm.patchValue(this.data);
      this.isEditing = true;
    } else {
      this.isEditing = false;
    }
  }

  onNoClick(): void {
    this.toast.show(ToastType.Success, (this.isEditing) ? 'TOAST_UPDATE_USER' : 'TOAST_CREATE_USER');
    setTimeout(() => {
      this.dialogRef.close();
    }, 1000);
  }

  onUserClick() {
    this.getFormValidationErrors(this.userForm);
		let reqBody = this.userForm.value;
    reqBody.roles = Object.assign([], this.userForm.value.roles);
		if (!this.isEditing) {
			this.subs.add(
				this.userService.register(reqBody)
				.pipe(
					catchError((err) => {
            this.dialogRef.close();
						return throwError(err);
				}))
				.subscribe(response => {
          this.onNoClick();
				})
			);
		} else {
			this.subs.add(
				this.userService.updateUser(reqBody, this.data.id)
        .pipe(
					catchError((err) => {
						return throwError(err);
				}))
        .subscribe(
					async response => {
						this.onNoClick();
					}
        )
			);
		}
  }

  getFormValidationErrors(form: FormGroup) {
  const result: any = [];
    Object.keys(form.controls).forEach(key => {
      const controlErrors: any = form.get(key).errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          result.push({
            'control': key,
            'error': keyError,
            'value': controlErrors[keyError]
          });
        });
      }
    });
  return result;
}


}
