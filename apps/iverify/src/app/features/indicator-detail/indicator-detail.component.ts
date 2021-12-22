import { Component, Input } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { CountBy } from "@iverify/common/src";
import { ChartTypeEnum } from "@iverify/core/models/dashboard";
import { Observable } from "rxjs";
import { IndicatorDetailService, IndicatorDetailState } from "./indicator-detail.service";

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

      form = this.fb.group({
        startDate: new Date(),
        endDate: new Date(),
        chartSelection: ['male']
      })


      chartType$: Observable<ChartTypeEnum> = this.stateService.chartType$;
      formattedData$: Observable<any> = this.stateService.formattedData$;
      data$: Observable<any[]> = this.stateService.data$;
      constructor(private stateService: IndicatorDetailService, private fb: FormBuilder){
      }

      ngOnInit(){
        this.form.setValue({
          startDate: this.startDate,
          endDate: this.endDate,
          chartSelection: 'male'
        })
      }

      getStatisticsByDates(){
        const startDate = this.form.controls['startDate'].value;
        const endDate = this.form.controls['endDate'].value;
        this.stateService.updateDateRange(startDate, endDate);
      }


  }