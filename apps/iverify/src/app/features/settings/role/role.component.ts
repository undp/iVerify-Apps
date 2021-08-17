import { Component, OnInit, ViewContainerRef, Inject, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '@iverify/core/users/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastType } from '../../toast/toast.component';
import { ToastService } from '../../toast/toast.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { RoleItem, RoleRequest, Resource} from '@iverify/core/models/roles';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable, of } from 'rxjs';
import {map, startWith, filter} from 'rxjs/operators';
import { User } from '@iverify/core/models/user';
import { selectUser } from '@iverify/core/store/selectors/user.selector';
import { AppState } from '@iverify/core/store/states/app.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'iverify-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  subs: Subscription;
  isEditing: boolean = false;
  roleForm: FormGroup;
  showPassword: boolean = false;
  role: RoleItem[];

  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  priviledgeCtrl = new FormControl();
  filteredPriviledges: Observable<string[]>;
  defaultPriviledges: string[] = ['read'];
  priviledges: string[] = ["read","write","update","delete"];
  sectionList: string[] = ['roles','users'];
  selectedSects: string[];
  user: User;
  user$: Observable<User> = this.store
    .select(selectUser)
    .pipe(filter(user => user !== null));

  @ViewChild('priviledgeInput') priviledgeInput: ElementRef<HTMLInputElement>;

  constructor(
    private store: Store<AppState>,
    private userService: UserService, 
    private toast: ToastService,
    @Inject(ViewContainerRef) private viewContainerRef: ViewContainerRef,
      public dialogRef: MatDialogRef<RoleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.subs = new Subscription();
      toast.setViewContainerRef(viewContainerRef);
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


ngOnInit(): void {
  this.roleForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      resource: new FormControl('', Validators.required)
  });

  this.user$.subscribe((currentUser) => {
    this.user = currentUser;
  });

  if (this.data && this.data.id > 0) {
    this.roleForm.patchValue(this.data);
    const resources = JSON.parse(this.data.resource);
    this.defaultPriviledges = (resources[0])? resources[0].permissions: this.defaultPriviledges;
    this.selectedSects = resources.map( (item: any) => item.name);
    this.isEditing = true;
  } else {
    this.isEditing = false;
  }

  this.filteredPriviledges = this.priviledgeCtrl.valueChanges.pipe(
      startWith(null),
      map((item: string | null) => item ? this._filter(item) : this.priviledges.filter(item => !this.defaultPriviledges.includes(item))));  
}

  onNoClick(): void {
    this.toast.show(ToastType.Success, 'TOAST_CREATE_ROLE');
    setTimeout(() => {
      this.dialogRef.close();
    }, 1000);
  }

  onRoleClick() {
    if (this.roleForm.value && this.roleForm.value.resource) {
        let resources: Resource[] = [];
        let resArr = this.roleForm.value.resource;
        resArr.map((item: any)=> {
          resources.push({
            "name": item,
            "permissions": this.defaultPriviledges
          });
        })
      this.roleForm.value.resource = resources;
    }
    let reqBody = this.roleForm.value;
			this.subs.add(
				this.userService.updateRoles(reqBody, this.data.id)
				.pipe(
					catchError((err) => {
						return throwError(err);
				}))
				.subscribe(response => {
          this.onNoClick();
				})
			);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.defaultPriviledges.push(value);
    }
    event.chipInput!.clear();
    this.priviledgeCtrl.setValue(value);
  }

  remove(item: string): void {
    const index = this.defaultPriviledges.indexOf(item);
    if (index >= 0) {
      this.defaultPriviledges.splice(index, 1);
    }
    this.priviledgeCtrl.setValue(null);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.defaultPriviledges.push(event.option.viewValue);
    this.priviledgeInput.nativeElement.value = '';
    this.priviledgeCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    let temp = this.priviledges.filter(item => item.toLowerCase().includes(filterValue));
    return temp.filter(item => !this.defaultPriviledges.includes(item));
  }

}
