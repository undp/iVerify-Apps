import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/auth/dashboard/dashboard.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DashboardComponent
    // redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule {}
