import { Component, Input } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { CountBy } from "@iverify/common/src";
import { ChartTypeEnum } from "@iverify/core/models/dashboard";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { filter, map, skip } from "rxjs/operators";
import { IndicatorDetailService, IndicatorDetailState } from "./indicator-detail.service";
import { EnumValues } from 'enum-values';

@Component({
    selector: 'iverify-indicator-detail',
    templateUrl: './indicator-detail.component.html',
    styleUrls: ['./indicator-detail.component.scss'],
    providers: [IndicatorDetailService]
  })
  export class IndicatorDetailComponent  {
      @Input() set data(value: any[]){
        this.stateService.updateData(value);
      }

      @Input() set dataType(value: CountBy){
        this.stateService.updateDataType(value);
      };

      @Input() startDate: Date;
      @Input() endDate: Date;
      @Input() inputChartType: Date;


      ChartTypeEnum = ChartTypeEnum;
      chartTypeValues = EnumValues.getValues(ChartTypeEnum).filter(v => v !== ChartTypeEnum.BUBBLE.toString());
      chartsForAgentsAllStatuses: string[] = [
        ChartTypeEnum.STACKED.toString(), 
        ChartTypeEnum.VERTICAL_BAR_STACKED.toString(), 
        ChartTypeEnum.NORMALIZED_HORIZONTAL_BAR.toString(), 
        ChartTypeEnum.NORMALIZED_VERTICAL_BAR.toString()
      ];

      form = this.fb.group({
        startDate: new Date(),
        endDate: new Date(),
        chartSelection: [null],
      })


      chartType$: Observable<ChartTypeEnum> = this.stateService.chartType$;
      formattedData$: Observable<any> = this.stateService.formattedData$;
      data$: Observable<any[]> = this.stateService.data$;
      dataType$: Observable<CountBy> = this.stateService.dataType$;
      chartTypeChanges$: Observable<any> = this.form.controls['chartSelection'].valueChanges;
      chartTypeValues$: Observable<any> = this.dataType$.pipe(filter(t => !!t), map((type: CountBy) => {
        console.log('datatypeeeeee: ', type)
        if(type === CountBy.agentAllStatuses) return this.chartTypeValues.filter(v => this.chartsForAgentsAllStatuses.includes(v.toString()));
        else return this.chartTypeValues;
      }))

      constructor(
        private stateService: IndicatorDetailService, 
        private fb: FormBuilder, 
        public translate: TranslateService,
        ){
        this.chartTypeChanges$.subscribe(value => this.stateService.updateChartType(value));
      }


      ngOnInit(){
        this.form.setValue({
          startDate: this.startDate,
          endDate: this.endDate,
          chartSelection: this.inputChartType
        })
      }

      getStatisticsByDates(){
        const startDate = this.form.controls['startDate'].value;
        const endDate = this.form.controls['endDate'].value;
        this.stateService.updateDateRange(startDate, endDate);
      }


  }