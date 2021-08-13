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
  
  constructor(
    private userService: UserService, 
    private toast: ToastService,
    @Inject(ViewContainerRef) private viewContainerRef: ViewContainerRef,
      public dialogRef: MatDialogRef<UsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.subs = new Subscription();
      toast.setViewContainerRef(viewContainerRef);
  }

   
  ngOnInit(): void {
    this.role = [
      {
        "id": 1,
        "name": "admin",
        "description": "string",
        "resource": [{"name":"users","permissions":["read"]},{"name":"roles","permissions":["read"]}]
      }
    ];

  this.userForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      phone: new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
      address: new FormControl('')
  });

  }

  onNoClick(): void {
    this.dialogRef.close('TOAST_CREATE_USER');
  }

  onUserClick() {
		if (!this.isEditing) {
			const reqBody = this.userForm.value;
      reqBody.roles = this.role;
			this.subs.add(
				this.userService.register(reqBody)
				.pipe(
					catchError((err) => {
						return throwError(err);
				}))
				.subscribe(response => {
          this.onNoClick();
				})
			);
		} else {
			// const reqBody 	= this.userForm.value;
			// msgTemplate 	= 'TOAST_UPDATE_USER';
			// if (reqBody && isEmpty(reqBody.password)) {
			// 	delete reqBody.password;
			// }
			// if (!this.isApproved) {
			// 	reqBody.active 	= true;
			// 	msgTemplate 	= 'TOAST_APPROVE_USER';
			// }
			// this.subs.add(
			// 	this.userService.updateUser(reqBody, this.editId).subscribe(
			// 		async response => {
			// 			this.generateUserExtra( { info: { ...response, ...reqBody }, isEditing: this.isEditing });
			// 			this.onModalClose.next(false);
			// 		}
      //   		)
			// );
			// this.toast.show(ToastType.Success, msgTemplate);
		}

  }


}
