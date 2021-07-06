import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginGuard } from '@iverify/core/guards/login-guard';
import { TranslateModule } from '@ngx-translate/core';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    TranslateModule,
    FontAwesomeModule
  ],
  declarations: [LoginComponent],
  entryComponents: [LoginComponent]
})
export class AuthModule {}
