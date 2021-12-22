import { Injectable } from "@angular/core";
import { CountBy } from "@iverify/common/src";
import { DashboardService } from "@iverify/core/domain/dashboad.service";
import { DashboardHelpers } from "@iverify/core/domain/dashboard.helpers";
import { ChartTypeEnum } from "@iverify/core/models/dashboard";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { distinctUntilChanged, filter, map, shareReplay, switchMap } from "rxjs/operators";

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
        chartType: ChartTypeEnum.BAR,
        startDate: null,
        endDate: null
    }
    private state: BehaviorSubject<IndicatorDetailState> = new BehaviorSubject(this._state);
    private state$: Observable<IndicatorDetailState> = this.state.asObservable();
    dataType$: Observable<CountBy> = this.state$.pipe(map(state => state.dataType), distinctUntilChanged(), shareReplay(1));
    data$: Observable<any> = this.state.pipe(map(state => state.data), filter(data => !!data), shareReplay(1));
    chartType$: Observable<ChartTypeEnum> = this.state.pipe(map(state => state.chartType), distinctUntilChanged(), shareReplay(1));
    startDate$: Observable<string> = this.state.pipe(map(state => DashboardHelpers.FormatDate(state.startDate)), distinctUntilChanged(), shareReplay(1));
    endDate$: Observable<string> = this.state.pipe(map(state => DashboardHelpers.FormatDate(state.endDate)), distinctUntilChanged(), shareReplay(1));
    formattedData$: Observable<any> = combineLatest([this.data$, this.chartType$]).pipe(map(([data, chartType]) => this.formatData(data, chartType)));
    dataFetch$: Observable<any> = combineLatest([this.startDate$, this.endDate$]).pipe(
        map(([startDate, endDate]) => ({startDate, endDate})), 
        switchMap(range => this.dashboardService.list(range)),
        map(res => res['results'])
        );

    constructor(private dashboardService: DashboardService){
        combineLatest([this.dataFetch$, this.dataType$]).pipe(
            map(([dataFetch, dataType]) => dataFetch[dataType]),
        ).subscribe(data => this.updateData(data))
    }

    private updateState(newState: IndicatorDetailState){
        console.log('Updating indicator detail state to: ', newState);
        this.state.next(this._state = {...this.state, ...newState});
    }

    updateData(data: any[]){
        console.log('updating data: ', data)
        const newState: IndicatorDetailState = {...this._state, data};
        this.updateState(newState);
    }

    updateDataType(dataType: CountBy){
        console.log('updating data type: ', dataType)
        const newState: IndicatorDetailState = {...this._state, dataType};
        this.updateState(newState);
    }

    updateDateRange(startDate: Date, endDate: Date){
        console.log('updating data range: ', startDate, endDate)
        const newState: IndicatorDetailState = {...this._state, startDate, endDate};
        this.updateState(newState);
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