import { Component, Input } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { CountBy } from "@iverify/common/src";
import { ChartTypeEnum } from "@iverify/core/models/dashboard";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { skip } from "rxjs/operators";
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

      ChartTypeEnum = ChartTypeEnum;
      chartTypeValues = EnumValues.getValues(ChartTypeEnum).filter(v => v !== ChartTypeEnum.BUBBLE.toString());

      form = this.fb.group({
        startDate: new Date(),
        endDate: new Date(),
        chartSelection: [ChartTypeEnum.BAR]
      })


      chartType$: Observable<ChartTypeEnum> = this.stateService.chartType$;
      formattedData$: Observable<any> = this.stateService.formattedData$;
      data$: Observable<any[]> = this.stateService.data$;
      chartTypeChanges$: Observable<any> = this.form.controls['chartSelection'].valueChanges;

      constructor(
        private stateService: IndicatorDetailService, 
        private fb: FormBuilder, 
        public translate: TranslateService,
        ){
        this.chartTypeChanges$.pipe(skip(1)).subscribe(value => this.stateService.updateChartType(value));
      }


      ngOnInit(){
        this.form.setValue({
          startDate: this.startDate,
          endDate: this.endDate,
          chartSelection: ChartTypeEnum.BAR
        })
      }

      getStatisticsByDates(){
        const startDate = this.form.controls['startDate'].value;
        const endDate = this.form.controls['endDate'].value;
        this.stateService.updateDateRange(startDate, endDate);
      }


  }