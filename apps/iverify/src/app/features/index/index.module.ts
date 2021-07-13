import { RouterModule, Routes } from '@angular/router';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { IndexComponent } from './index.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PrivateSiteGuard } from '@iverify/core/guards/private-site.guard';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ToastModule } from '../toast/toast.module';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


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
    TranslateModule,
    NgbModule,
    FontAwesomeModule,
    NgHttpLoaderModule,
    CommonModule,
    ToastModule,
    FormsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [IndexComponent, DashboardComponent],
  exports: [IndexComponent]
})
export class IndexModule {}
