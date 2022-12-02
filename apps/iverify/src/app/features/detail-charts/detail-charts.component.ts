import { Component, OnDestroy, Input, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartTypeEnum } from '@iverify/core/models/dashboard';
import { curveBasis } from 'd3-shape';
import { TranslateService } from '@ngx-translate/core';
import { DataRange } from '@iverify/core/models/dashboard';

@Component({
    selector: 'iverify-detail-charts',
    templateUrl: './detail-charts.component.html',
    styleUrls: ['./detail-charts.component.scss'],
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
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = true;
    showXAxisLabel = true;
    xAxisLabelBubbleChart = 'BUBBLE_CHART';
    yAxisLineChart = 'LINE_CHART';
    yAxisLabel = 'Count';
    showYAxisLabel = true;
    xAxisLabel = '';
    tickIndex = 0;
    quickest = '';
    longest = '';
    day = '';
    days = '';
    curve: any = curveBasis;
    colorScheme: any = [
        {
            domain: ['#D3D3D3'],
        },
        {
            domain: ['#E05548', '#FFA033'],
        },
        {
            domain: [
                '#E05548',
                '#FFA033',
                '#7E9E0A',
                '#FF5733',
                '#FFD433',
                '#6BFF33',
                '#33FF77',
                '#33FFB5',
                '#3358FF',
                '#C133FF',
            ],
        },
        {
            domain: ['#7E9E0A'],
        },
    ];

    constructor(protected translate: TranslateService) {
        this.quickest = translate.instant('QUICKEST');
        this.longest = translate.instant('LONGEST');
        this.day = translate.instant('DAY');
        this.days = translate.instant('DAYS');
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
        const text = val > 1 ? this.days : this.day;
        if (val == DataRange.min) {
            tickVal = `${this.quickest} ${val} ${text}`;
        } else if (val == DataRange.avg) {
            tickVal = `Media ${val} ${text}`;
        } else if (val == DataRange.max) {
            tickVal = `${this.longest} ${val} ${text}`;
        }
        return tickVal;
    }

    ngOnDestroy() {}

    pieChartLabel(series: any[], name: string): string {
        const item = series.filter((data) => data.name === name);
        if (item.length > 0) {
            return item[0].label;
        }
        return name;
    }
}
