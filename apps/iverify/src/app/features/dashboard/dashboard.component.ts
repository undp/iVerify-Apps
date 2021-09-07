import { Component, OnDestroy, OnInit, AfterViewInit} from '@angular/core';
import { DashboardHelpers } from '@iverify/core/domain/dashboard.helpers';
import { Subscription } from 'rxjs';
import { DashboardService } from '@iverify/core/domain/dashboad.service';
import { FormGroup, FormControl } from '@angular/forms';
import { TicketRequest, StatusFormat, StatusFormatPieChart, TicketsByAgentFormat, BubbleChartFormat } from '@iverify/core/models/dashboard';

export const bubbleData : BubbleChartFormat[] =  [
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

const BubbleChartViewSize: any = {
  WEB_VIEW_SIZE : [600, 150],
  MOBILE_VIEW_SIZE : [250, 150]
}
@Component({
  selector: 'iverify-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {

  subs: Subscription;
  statData: any;
  agentsSourceData: any;
  ticketsByChannel: StatusFormat[];
  ticketsByType: StatusFormat[];
  ticketsByTag: StatusFormat[];
  ticketsByCurrentStatus: StatusFormatPieChart[];
  ticketsByAgents: TicketsByAgentFormat[];
  totalPublished: any;
  ticketsByWeek: any;
  selectedTimeType: number = 1;
  breakpoint: number = 3;
  bubbleData = bubbleData;  
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  options: TicketRequest = {startDate: '', endDate: ''};
  bubbleChartViewSize: [number, number];
  responseVelocity: string = 'RESPONSE_TIME';
  
  constructor(
    // private toast: ToastService,
    private dashboardService: DashboardService
  ) {

    this.subs = new Subscription();
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 3;
    this.getScreenSizeView(window.innerWidth);    
  }

  ngAfterViewInit() { 
  }

  ngOnInit() {
    let previousMonday = new Date(DashboardHelpers.GetPreviousWeekFirstDay());
    this.options.startDate =  DashboardHelpers.FormatDate(previousMonday);
    this.options.endDate =  DashboardHelpers.FormatDate(new Date());
    this.range.patchValue({
      start: this.options.startDate,
      end: this.options.endDate
    });
    this.getStatistics();
  }

  onResize(event: any) {
    this.breakpoint = (event.target.innerWidth <= 600) ? 1 : (event.target.innerWidth < 992) ? 2 : 3;
    this.getScreenSizeView(event.target.innerWidth); 
  }

  getScreenSizeView(innerWidth: number) {
    this.bubbleChartViewSize = BubbleChartViewSize.WEB_VIEW_SIZE;
    if (innerWidth <= 400) {
      this.bubbleChartViewSize = BubbleChartViewSize.MOBILE_VIEW_SIZE;
    }
  }

  getStatistics() {
    this.subs.add(
      this.dashboardService.list(this.options).subscribe((res) => {
        this.statData = res;
        this.agentsSourceData = DashboardHelpers.SortStatistics(this.statData.results);
        this.ticketsByChannel = DashboardHelpers.GetTicketsByChannel(this.agentsSourceData['source']);
        this.ticketsByTag = DashboardHelpers.GetTicketsByTag(this.agentsSourceData['tag']);
        this.ticketsByType = DashboardHelpers.GetTicketsByTag(this.agentsSourceData['status']);
        this.ticketsByCurrentStatus = DashboardHelpers.GetTicketsByCurrentStatus(this.agentsSourceData);
        this.ticketsByWeek = DashboardHelpers.GetTicketsByWeek(this.statData.results);  
        this.ticketsByAgents = DashboardHelpers.GetTicketsByAgents(this.agentsSourceData);
        this.totalPublished = (this.agentsSourceData['createdVsPublished'])? this.agentsSourceData['createdVsPublished'][0][1] : null;
      })
    );
  }

  getStatisticsByDates() {
    this.options.startDate = DashboardHelpers.FormatDate(this.range.get('start')?.value);
    this.options.endDate = DashboardHelpers.FormatDate(this.range.get('end')?.value);
    this.getStatistics();
  }

  getAllTicketsData() {
    if (this.selectedTimeType === 1) {
      this.responseVelocity = 'RESPONSE_TIME';
    } else {
      this.responseVelocity = 'RESOLVE_TIME';
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}