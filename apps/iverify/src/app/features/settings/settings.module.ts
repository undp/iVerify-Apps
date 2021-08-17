import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule} from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RoleComponent } from './role/role.component';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { ToastModule } from '../toast/toast.module';
import { DialogComponent } from './dialog.component';

export const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent
  }
];

@NgModule({
  declarations: [
    UsersComponent,
    UserManagementComponent,
    RoleComponent,
    DialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ToastModule,
    TranslateModule,
    MatTableModule,
    MatTabsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatRippleModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    MatAutocompleteModule,
    ScrollingModule,
    MatDialogModule,
    MatCheckboxModule,
    MatDividerModule,
    MatExpansionModule
  ],
  exports: [

  ]
})
export class SettingsModule {

}
