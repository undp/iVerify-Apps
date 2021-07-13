import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@iverify/core/environments/environment';
import { DashboardHelpers } from '@iverify/core/domain/dashboard.helpers';
import { AppState } from '@iverify/core/store/states/app.state';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DashboardService } from '@iverify/core/domain/dashboad.service';

@Component({
  selector: 'iverify-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  subs: Subscription;
  fromdate: Date;
  todate: Date;
  statData: any;
  
  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    // private toast: ToastService,
    private router: Router,
    // private modalService	: NgbModal,
    private dashboardService: DashboardService
  ) {
    this.subs = new Subscription();
  }

  ngOnInit() {
    this.getStatistics();
  }

  getStatistics() {
    let options = {
      startDate: DashboardHelpers.FormatDate(this.fromdate),
      endDate: DashboardHelpers.FormatDate(this.todate)
    }
    this.subs.add(
      this.dashboardService.list(options).subscribe((results) => {
        this.statData = results;

      })
    );

  }

  ngOnDestroy() {

  }
}