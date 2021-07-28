import { RouterModule, Routes } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { IndexComponent } from './index.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PrivateSiteGuard } from '@iverify/core/guards/private-site.guard';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ChartComponent } from '../charts/charts.component';
import { ToastModule } from '../toast/toast.module';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatCommonModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: IndexComponent,
    canActivate: [PrivateSiteGuard],
    children: [
      {
        path: 'index',
        component: DashboardComponent
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsModule)
      }
    ]
  },
  { path: '', redirectTo: '/dashboard/index', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModule,
    FontAwesomeModule,
    NgHttpLoaderModule.forRoot(),
    CommonModule,
    ToastModule,
    FormsModule,
    NgxChartsModule,
    ReactiveFormsModule,
    MatCommonModule,
    MatMenuModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatBottomSheetModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRippleModule,
    MatGridListModule,
    MatSelectModule,
    MatSidenavModule,
    MatDividerModule
  ],
  providers: [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [IndexComponent, DashboardComponent, ChartComponent],
  exports: [IndexComponent]
})
export class IndexModule {}
