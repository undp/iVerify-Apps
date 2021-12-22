import { Component, OnDestroy, OnInit, AfterViewInit} from '@angular/core';
import { DashboardHelpers } from '@iverify/core/domain/dashboard.helpers';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DashboardService } from '@iverify/core/domain/dashboad.service';
import { FormGroup, FormControl } from '@angular/forms';
import { isEmpty } from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { TicketRequest, StatusFormat, StatusFormatPieChart, TicketsByAgentFormat, BubbleChartFormat, ChartTypeEnum } from '@iverify/core/models/dashboard';
import { CountBy } from '@iverify/common/src';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog } from '@angular/material/dialog';

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
  statsByCategories: any;
  ticketsByChannel: StatusFormat[];
  ticketsByType: StatusFormat[];
  ticketsByTag: StatusFormat[];
  ticketsByCurrentStatus: StatusFormatPieChart[];
  ticketsByAgents: TicketsByAgentFormat[];
  ticketsReponseTime: any = {};
  totalPublished: any;
  ticketsByWeek: any;
  ticketsByFolder: any;
  selectedTimeType: number = 1;
  breakpoint: number = 3;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  options: TicketRequest = {startDate: '', endDate: ''};
  bubbleChartViewSize: [number, number];
  responseVelocity: string = 'RESPONSE_TIME';
  startDate: any = new Date();
  endDate: any = new Date();
  isData: boolean = false;
  isDefaultData: boolean = true;
  title: string = '';

  CountBy = CountBy;
  dataResults: any;
  ChartTypeEnum = ChartTypeEnum
  
  constructor(
    private dashboardService: DashboardService,
    private translate: TranslateService,
    public dialog: MatDialog
  ) {

    this.subs = new Subscription();
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 3;
    this.getScreenSizeView(window.innerWidth);    
    this.translate.get("TITLE").subscribe((title) => {
      this.title = this.translate.instant(title);
    });
  }

  ngAfterViewInit() { 
  }

  ngOnInit() {
    let previousMonday = new Date(DashboardHelpers.GetPreviousWeekFirstDay());
    this.startDate =  DashboardHelpers.FormatDate(previousMonday);
    this.endDate =  DashboardHelpers.FormatDate(new Date());
    this.options = { startDate: this.startDate, endDate: this.endDate };
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
    this.statData = {};
    this.subs.add(
      this.dashboardService.list(this.options)
      .pipe(map(res => res.results))
      .subscribe((res) => {
        this.isData = (res && isEmpty(res)) ? false : true;
        this.dataResults = res;
        this.statsByCategories = DashboardHelpers.SortStatistics(res);
        this.ticketsByChannel = DashboardHelpers.GetTicketsByChannel(this.statsByCategories['source']);
        this.ticketsByTag = DashboardHelpers.GetTicketsByTag(this.statsByCategories['tag']);
        this.ticketsByType = DashboardHelpers.GetTicketsByType(this.statsByCategories['violationType']);
        this.ticketsByWeek = DashboardHelpers.GetTicketsByFolder(this.statsByCategories['verifiedByDay']); //DashboardHelpers.GetTicketsByWeek(res, this.options);  
        this.ticketsByAgents = DashboardHelpers.GetTicketsByAgents(this.statsByCategories);
        this.ticketsByFolder = DashboardHelpers.GetTicketsByFolder(this.statsByCategories['folder']);
        this.ticketsReponseTime = DashboardHelpers.GetTicketsReponseTime(this.statsByCategories['responseVelocity'], this.title);
        if (this.isDefaultData) {
          this.ticketsByCurrentStatus = DashboardHelpers.GetTicketsByCurrentStatus(this.statsByCategories);
          this.totalPublished = (this.ticketsByCurrentStatus && this.ticketsByCurrentStatus[2]) ? this.ticketsByCurrentStatus[2].value : 0;
        }
      })
    );
  }

  getStatisticsByDates() {
    this.options.startDate = DashboardHelpers.FormatDate(this.startDate);
    this.options.endDate = DashboardHelpers.FormatDate(this.endDate);
    this.isDefaultData = false;
    this.getStatistics();
  }

  getAllTicketsData() {
    if (this.selectedTimeType === 1) {
      this.ticketsReponseTime = DashboardHelpers.GetTicketsReponseTime(this.statsByCategories['responseVelocity'], this.title);
      this.responseVelocity = 'RESPONSE_TIME';
    } else {
      this.ticketsReponseTime = DashboardHelpers.GetTicketsReponseTime(this.statsByCategories['resolutionVelocity'], this.title);
      this.responseVelocity = 'RESOLVE_TIME';
    }
  }

  openDetailModal(dataType: CountBy, title: string) {
    const data = this.dataResults[dataType]
    console.log('statsdata...', this.dataResults)

    console.log('data...', data)
    this.dialog.open(ModalComponent, {
      minHeight: '90%',
      minWidth: '90%',
      height: '90%',
      data: {
        data,
        dataType,
        title,
        startDate: this.startDate,
        endDate: this.endDate
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}