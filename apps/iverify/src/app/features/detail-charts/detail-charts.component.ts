import { Component, OnDestroy, Input, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartTypeEnum } from '@iverify/core/models/dashboard';
import { curveBasis } from 'd3-shape';
import { TranslateService } from '@ngx-translate/core';
import { DataRange } from '@iverify/core/models/dashboard';

@Component({
  selector: 'iverify-detail-charts',
  templateUrl: 'detail-charts.component.html',
  styleUrls: ['./detail-charts.component.scss']
})
export class DetailChartComponent {

  subs: Subscription;

  @Input() data: any;
  @Input() chartType: ChartTypeEnum;
  @Input() viewVal: [number, number];
  @Input() view: [number, number];
  single: any[];
  ChartTypeEnum = ChartTypeEnum;
  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabelBubbleChart: string = 'BUBBLE_CHART';
  yAxisLabel: string = 'Count';
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
    if (this.chartType === ChartTypeEnum.BUBBLE) {
      DataRange.min = this.data.dataRange.min;
      DataRange.max = this.data.dataRange.max;
      DataRange.avg = this.data.dataRange.avg;
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
    const text = (val > 1) ? 'days' : 'day';
    if (val == DataRange.min) {
      tickVal = `El más rápido ${val} ${text}`;
    } else if (val == DataRange.avg) {
      tickVal = `Media ${val} ${text}`;
    } else if (val == DataRange.max) {
      tickVal = `El más largo ${val} ${text}`;
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