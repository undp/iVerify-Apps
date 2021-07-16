
import { BaseModel, BaseModelArray } from '../base/base-model';


export enum TicketsByType {
  agentUnstarted = 'agentUnstarted',
  agentProcessing = 'agentProsessing',
  agentSolved = 'agentSolved',
  type = 'type',
  channel = 'channel',
  tag = 'tag',
  status = 'status',
  source = 'source',
  createdVsPublished = 'createdVsPublished', 
  resolutionVelocity = 'resolutionVelocity',
  responseVelocity = 'resolutionVelocity' 
}

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
  STACKED = 4,
  BUBBLE = 5
}

export interface statusFormat {
    name: string,
    value: number;
}
export interface statusFormatPieChart {
    name: string,
    value: number;
    label: string;
}

export interface TicketCatResFormat {
  category: string;
  count: number;

}

