import { Component, OnInit, ViewContainerRef, Inject } from '@angular/core';
import { UserService } from '@iverify/core/users/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastType } from '../../toast/toast.component';
import { ToastService } from '../../toast/toast.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


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

  this.userForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      roles: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.pattern('[0-9]*')),
      address: new FormControl('')
    });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getUsersList() {
    // this.listOption = {
    //   offset: this.offset,
    //   limit: this.limit,
    //   orderby: 'realname',
    //   order: OrderSort.Asc,
    //   active: (this.isApproved) ? 1 : 0
    // };
    // this.subs.add(
    //   this.userService.list(this.listOption).subscribe(data => {
    //     this.users = data.results;
    //     if (!this.isApproved) {
    //       this.users = this.users.filter(item => item.active === false);
    //     }
    //     this.total_count = data.total_count;
    //     if (!this.isApproved) {
    //       this.updateCount.next(this.total_count);
    //     }
    //   })
    // );
  }

  onUserClick() {

    let msgTemplate    = 'TOAST_CREATE_USER';
    let errorTemplate  = 'TOAST_CREATE_USER_ERROR';
		if (!this.isEditing) {
			const reqBody = this.userForm.value;
			this.subs.add(
				this.userService.register(reqBody)
				.pipe(
					catchError((err) => {
						if (err && err.statusText) {
							this.toast.show(ToastType.Danger, err.statusText);
						}
						return throwError(err);
				}))
				.subscribe(async response => {
					// if(undefined !== response["error"]){
					// 	this.toast.show(ToastType.Danger, response["error"]["message"]);
					// } else {
					// 	this.toast.show(ToastType.Success, msgTemplate);
					// }
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
