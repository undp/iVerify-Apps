import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardService } from '@iverify/core/domain/dashboad.service';
import { ChartTypeEnum } from '@iverify/core/models/dashboard';
import { curveBasis } from 'd3-shape';

const multi =  [
  {
    "name": "Unstarted",
    "series": [
      {
        "name": "Mon",
        "value": 25
      },
      {
        "name": "Tue",
        "value": 30
      },
      {
        "name": "Wed",
        "value": 10
      }
    ]
  },

  {
    "name": "Inprogress",
    "series": [
      {
        "name": "Mon",
        "value": 40
      },
      {
        "name": "Thu",
        "value": 10
      },
      {
        "name": "Wed",
        "value": 30
      },
      {
        "name": "Fri",
        "value": 30
      }
    ]
  },

  {
    "name": "Completed",
    "series": [
      {
        "name": "Mon",
        "value": 10
      },
      {
        "name": "Thu",
        "value": 30
      },
      {
        "name": "Fri",
        "value": 20
      },
      {
        "name": "Sat",
        "value": 20
      },
      {
        "name": "Sun",
        "value": 20
      }
    ]
  }  
];


@Component({
  selector: 'iverify-charts',
  templateUrl: 'charts.component.html',
  styleUrls: ['charts.component.scss']
})
export class ChartComponent implements OnInit, OnDestroy {

  subs: Subscription;

  @Input() data: any;
  @Input() chartType: number;
  single: any[];
  view: [number, number] = [300, 100];
  ChartTypeEnum = ChartTypeEnum;

  // options
  showXAxis: boolean = false;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = false;
  yAxisLabel: string = '';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = '';  
  multi = multi;
  tickIndex: number = 0;
  curve: any = curveBasis;
    
  constructor(
    private dashboardService: DashboardService
  ) {
    this.subs = new Subscription();
  }

  ngOnInit() {
  }

  colorScheme = [
    {
      domain: ['#AAAAAA']
    },
    {
      domain: ['#E05548', '#FFA033']
    },
    {
      domain: ['#E05548', '#FFA033','#7E9E0A']
    },
    {
      domain: ['#7E9E0A']
    }
  ];

  onSelect(event: Event) {
    // console.log(event);
  }

  onActivate(data: any): void {
    // console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  xticksFormatting(val: any) {
    let tickVal = '';
    if (val === 1) {
      tickVal = `Quickest ${val} h`;
    } else if (val === 4) {
      tickVal = `Average ${val} h`;
    } else if (val === 15) {
      tickVal = `Longest ${val} h`;
    }
     return tickVal;
  }

  ngOnDestroy() {

  }
  pieChartLabel(series: any[], name: string): string {
      const item = series.filter(data => data.name === name);
      if (item.length > 0) {
          return item[0].label;
      }
      return name;
  }
  
}