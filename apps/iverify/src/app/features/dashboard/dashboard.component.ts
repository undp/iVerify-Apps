import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardHelpers } from '@iverify/core/domain/dashboard.helpers';
import { AppState } from '@iverify/core/store/states/app.state';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DashboardService } from '@iverify/core/domain/dashboad.service';
import * as moment from 'moment';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

export const bubbleData =  [
  {
    name: 'Response',
    series: [
      {
        name: '1.2',
        x: 1.2,
        y: 0,
        r: 10
      },
      {
        name: '2.3',
        x: 2.3,
        y: 0,
        r: 10
      },
      {
        name: '2.9',
        x: 2.9,
        y: 0,
        r: 10
      },
      {
        name: '4.3',
        x: 4.3,
        y: 0,
        r: 10
      },
      {
        name: '7.9',
        x: 7.9,
        y: 0,
        r: 10
      },
      {
        name: '15.8',
        x: 15.8,
        y: 0,
        r: 10
      }
    ]
  }
  
];

@Component({
  selector: 'iverify-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  subs: Subscription;
  // fromdate: Date = DashboardHelpers.GetFirstLastDayMonth().firstDay;
  // todate: Date = DashboardHelpers.GetFirstLastDayMonth().lastDay;
  statData: any;
  agentsSourceData: any;
  ticketsByChannel: Object;
  ticketsByType: any;
  ticketsByTag: Object;
  ticketsByStatus: Object;
  ticketsByCurrentStatus: any;
  ticketsByAgents: any;
  totalPublished: any;
  ticketsByWeek: any;
  selectedTimeType: number = 1;
  breakpoint: number;
  bubbleData = bubbleData;  
  range = new FormGroup({
    start: new FormControl(DashboardHelpers.GetFirstLastDayMonth().firstDay),
    end: new FormControl(DashboardHelpers.GetFirstLastDayMonth().lastDay)
  });
  
  constructor(
    // private store: Store<AppState>,
    // private actions$: Actions,
    // private toast: ToastService,
    private router: Router,
    // private modalService	: NgbModal,
    private dashboardService: DashboardService
  ) {
    this.subs = new Subscription();
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 3;
  }

  ngOnInit() {
    this.getStatistics();
  }

  onResize(event: any) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 1 : 6;
  }

  getStatistics() {
    let options = {
      startDate: DashboardHelpers.FormatDate(this.range.get('start')?.value),
      endDate: DashboardHelpers.FormatDate(this.range.get('end')?.value)
    }
    this.subs.add(
      this.dashboardService.list(options).subscribe((res) => {
        // console.log(res.results);
        this.statData = res;
        this.agentsSourceData = DashboardHelpers.SortStatistics(res.results);
        this.ticketsByChannel = DashboardHelpers.GetTicketsByChannel(this.agentsSourceData['source']);
        this.ticketsByTag = DashboardHelpers.GetTicketsByTag(this.agentsSourceData['tag']);
        this.ticketsByType = DashboardHelpers.GetTicketsByTag(this.agentsSourceData['status']);
        this.ticketsByCurrentStatus = DashboardHelpers.GetTicketsByCurrentStatus(this.agentsSourceData);
        this.ticketsByCurrentStatus[1].value = 25;
        this.ticketsByAgents = DashboardHelpers.GetTicketsByAgents(this.agentsSourceData);
        this.totalPublished = (this.agentsSourceData['createdVsPublished'])? this.agentsSourceData['createdVsPublished'][0][1] : null;
      })
    );


    // Fetch statistics data by current week
    options.startDate = DashboardHelpers.FormatDate(moment().startOf('week').toDate());
    options.endDate = DashboardHelpers.FormatDate(moment().endOf('week').toDate());

    this.subs.add(
      this.dashboardService.list(options).subscribe((res) => {
        this.ticketsByWeek = DashboardHelpers.GetTicketsByWeek(res.results);        
      })
    );

  }

  getAllTicketsData() {

  }


  ngOnDestroy() {

  }
}