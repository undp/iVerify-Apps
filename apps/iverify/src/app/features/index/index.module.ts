import { RouterModule, Routes } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IndexComponent } from './index.component';
import { Component, NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PrivateSiteGuard } from '@iverify/core/guards/private-site.guard';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ToastModule } from '../toast/toast.module';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: IndexComponent,
    canActivate: [PrivateSiteGuard],
    children: [
      {
        path: 'map',
        component: DashboardComponent
      }
    ]
  },
  { path: '', redirectTo: '/dashboard/map', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    NgbModule,
    FontAwesomeModule,
    ToastModule
  ],
  declarations: [IndexComponent],
  exports: [IndexComponent]
})
export class IndexModule {}
