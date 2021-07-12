
import { BaseModel, BaseModelArray } from '../base/base-model';

export interface Tickets extends BaseModelArray<any> {
  range: {
    startDate: string,
    endDate: string,
  },
  results: any;
}

