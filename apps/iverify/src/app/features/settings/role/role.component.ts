import { Component, OnInit, ViewContainerRef, Inject, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '@iverify/core/users/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastType } from '../../toast/toast.component';
import { ToastService } from '../../toast/toast.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { RoleItem } from '@iverify/core/models/roles';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

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
  sectionList: string[] = ['Dashboard','Users'];

  @ViewChild('priviledgeInput') priviledgeInput: ElementRef<HTMLInputElement>;

  constructor(
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

  this.filteredPriviledges = this.priviledgeCtrl.valueChanges.pipe(
      startWith(null),
      map((item: string | null) => item ? this._filter(item) : this.priviledges.slice()));  
}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onRoleClick() {
    console.log(this.defaultPriviledges);
    console.log(this.getFormValidationErrors(this.roleForm));
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
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.defaultPriviledges.push(event.option.viewValue);
    this.priviledgeInput.nativeElement.value = '';
    this.priviledgeCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.priviledges.filter(item => item.toLowerCase().includes(filterValue));
  }


}
