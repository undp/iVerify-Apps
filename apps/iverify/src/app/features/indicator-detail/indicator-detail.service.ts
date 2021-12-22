import { Injectable } from "@angular/core";
import { CountBy } from "@iverify/common/src";
import { DashboardHelpers } from "@iverify/core/domain/dashboard.helpers";
import { ChartTypeEnum } from "@iverify/core/models/dashboard";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { distinctUntilChanged, filter, map, shareReplay } from "rxjs/operators";

export interface IndicatorDetailState{
    dataType: CountBy
    data: any[],
    chartType: ChartTypeEnum
}

@Injectable()
export class IndicatorDetailService {
    private _state: IndicatorDetailState = {
        dataType: null,
        data: null,
        chartType: ChartTypeEnum.BAR
    }
    private state: BehaviorSubject<IndicatorDetailState> = new BehaviorSubject(this._state);
    private state$: Observable<IndicatorDetailState> = this.state.asObservable();
    dataType$: Observable<CountBy> = this.state$.pipe(map(state => state.dataType), distinctUntilChanged(), shareReplay(1));
    data$: Observable<any[]> = this.state.pipe(map(state => state.data), filter(data => !!data), shareReplay(1));
    chartType$: Observable<ChartTypeEnum> = this.state.pipe(map(state => state.chartType), distinctUntilChanged(), shareReplay(1));
    formattedData$: Observable<any> = combineLatest([this.data$, this.chartType$]).pipe(map(([data, chartType]) => this.formatData(data, chartType)))

    constructor(){}

    private updateState(newState: IndicatorDetailState){
        console.log('Updating indicator detail state to: ', newState);
        this.state.next(this._state = {...this.state, ...newState});
    }

    updateData(data: any[]){
        const newState: IndicatorDetailState = {...this._state, data};
        this.updateState(newState);
    }

    updateDataType(dataType: CountBy){
        const newState: IndicatorDetailState = {...this._state, dataType};
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