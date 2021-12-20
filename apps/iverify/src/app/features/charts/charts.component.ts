import { Component, OnDestroy, Input, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartTypeEnum } from '@iverify/core/models/dashboard';
import { curveBasis } from 'd3-shape';
import { TranslateService } from '@ngx-translate/core';
import { ResTimeMinAvgLong } from '@iverify/core/models/dashboard';

@Component({
  selector: 'iverify-charts',
  templateUrl: 'charts.component.html',
  styleUrls: ['charts.component.scss']
})
export class ChartComponent implements  OnDestroy, OnChanges {

  subs: Subscription;

  @Input() data: any;
  @Input() chartType: number;
  @Input() viewVal: [number, number];
  single: any[];
  view: [number, number] = [300, 100];
  ChartTypeEnum = ChartTypeEnum;
  // options
  showXAxis: boolean = false;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = false;
  xAxisLabelBubbleChart: string = 'BUBBLE_CHART';
  yAxisLabel: string = '';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = '';  
  tickIndex: number = 0;
  curve: any = curveBasis;
  colorScheme = [
    {
      domain: ['#D3D3D3']
    },
    {
      domain: ['#E05548', '#FFA033']
    },
    {
      domain: ['#E05548', '#FFA033','#7E9E0A', '#FF5733', '#FFD433', '#6BFF33', '#33FF77', '#33FFB5', '#3358FF', '#C133FF']
    },
    {
      domain: ['#7E9E0A']
    }
  ];


  constructor(
    protected translate: TranslateService
  ) {
    this.subs = new Subscription();
  }

  ngOnChanges() {
    if (this.data && this.data.length === 1) {
      this.view = [300, 35];
    } else {
      this.view = [300, 100];
    }
  }

  onSelect(event: Event) {
    console.log('event');
  }

  onActivate(data: any): void {
    // console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  xticksFormatting(val: any) {
    let tickVal = '';
    if (val === ResTimeMinAvgLong.MIN) {
      tickVal = `El más rápido ${val} h`;
    } else if (val === ResTimeMinAvgLong.AVG) {
      tickVal = `Media ${val} h`;
    } else if (val === ResTimeMinAvgLong.MAX) {
      tickVal = `El más largo ${val} h`;
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