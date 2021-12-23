import { Injectable } from "@angular/core";
import { CountBy } from "@iverify/common/src";
import { DashboardService } from "@iverify/core/domain/dashboad.service";
import { DashboardHelpers } from "@iverify/core/domain/dashboard.helpers";
import { ChartTypeEnum } from "@iverify/core/models/dashboard";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { distinctUntilChanged, filter, map, shareReplay, switchMap, tap } from "rxjs/operators";
import { ResultsToChartModel } from "@iverify/core/models/charts-data-structures";

export interface IndicatorDetailState{
    dataType: CountBy
    data: any,
    chartType: ChartTypeEnum,
    startDate: Date,
    endDate: Date
}

@Injectable()
export class IndicatorDetailService {
    private _state: IndicatorDetailState = {
        dataType: null,
        data: null,
        chartType: null,
        startDate: null,
        endDate: null
    }

    private state: BehaviorSubject<IndicatorDetailState> = new BehaviorSubject(this._state);
    private state$: Observable<IndicatorDetailState> = this.state.asObservable();

    dataType$: Observable<CountBy> = this.state$.pipe(map(state => state.dataType), distinctUntilChanged(), shareReplay(1));
    data$: Observable<any> = this.state.pipe(map(state => state.data), filter(data => !!data), shareReplay(1), tap(data => console.log('new data in state...', data)));
    chartType$: Observable<ChartTypeEnum> = this.state.pipe(map(state => state.chartType), distinctUntilChanged(), shareReplay(1));
    startDate$: Observable<string> = this.state.pipe(map(state => state.startDate), filter(date => !!date), map(date => DashboardHelpers.FormatDate(date)), distinctUntilChanged(), shareReplay(1));
    endDate$: Observable<string> = this.state.pipe(map(state => state.endDate), filter(date => !!date), map(date => DashboardHelpers.FormatDate(date)), distinctUntilChanged(), shareReplay(1));

    formattedData$: Observable<any> = combineLatest([this.chartType$, this.dataType$, this.data$]).pipe(
        map(([chartType, dataType, data]) => ResultsToChartModel(chartType, dataType, data)),
        tap(formattedData => console.log('formattedData: ', formattedData))
        );

    dataFetch$: Observable<any> = combineLatest([this.startDate$, this.endDate$]).pipe(
        map(([startDate, endDate]) => ({startDate, endDate})), 
        switchMap(range => this.dashboardService.list(range)),
        map(res => res['results'])
        );


    constructor(private dashboardService: DashboardService){
        this.dataFetch$.subscribe(data => this.updateData(data))
    }

    private updateState(newState: IndicatorDetailState, initiator: string){
        console.log(`${initiator} - Updating indicator detail state to: `, newState);
        this.state.next(this._state = {...this._state, ...newState});
    }

    updateData(data: any[]){
        console.log('updating data: ', data)
        const newState: IndicatorDetailState = {...this._state, data};
        this.updateState(newState, 'Update Data');
    }

    updateDataType(dataType: CountBy){
        console.log('updating data type: ', dataType)
        const newState: IndicatorDetailState = {...this._state, dataType};
        this.updateState(newState, 'Update Data Type');
    }

    updateChartType(chartType: ChartTypeEnum){
        console.log('updating chart type: ', chartType)
        const newState: IndicatorDetailState = {...this._state, chartType};
        this.updateState(newState, 'Update Chart Type');
    }

    updateDateRange(startDate: Date, endDate: Date){
        console.log('updating data range: ', startDate, endDate)
        const newState: IndicatorDetailState = {...this._state, startDate, endDate};
        this.updateState(newState, 'Update Date Range');
    }


    private formatData(data: any, chartType: ChartTypeEnum){
        switch(chartType){
            case ChartTypeEnum.BAR: return this.formatBarChartData(data);
        }
    }

    private formatBarChartData(data: any[]){
        return DashboardHelpers.GetCountFromRes(data, 1000);
    }
  }