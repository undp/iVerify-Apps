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

      form = this.fb.group({
        chartSelection: ['1']
      })


      chartType$: Observable<ChartTypeEnum> = this.stateService.chartType$;
      formattedData$: Observable<any> = this.stateService.formattedData$;
      data$: Observable<any[]> = this.stateService.data$;
      constructor(private stateService: IndicatorDetailService, private fb: FormBuilder){
      }


  }