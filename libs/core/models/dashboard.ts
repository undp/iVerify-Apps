
import { BaseModel, BaseModelArray } from '../base/base-model';

export interface Tickets extends BaseModelArray<any> {
  range: {
    startDate: string,
    endDate: string,
  },
  results: any;
}

export enum ChartTypeEnum {
  BAR = 1,
  LINE = 2,
  PIE = 3,
  STACKED = 4
}


export interface TicketCatResFormat {
  category: string;
  count: number;

}

