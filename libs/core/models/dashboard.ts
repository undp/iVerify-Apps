
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

export interface TicketRequest {
  startDate: string,
  endDate: string,
}

export enum ChartTypeEnum {
  BAR = 1,
  LINE = 2,
  PIE = 3,
  STACKED = 4,
  BUBBLE = 5
}

export enum Statuses {
  InProgress = 'In Progress',
  Unstarted = 'Unstarted',
  PreChecked = 'Pre-checked',
  False = 'False',
  True = 'True',
  OutOfScope = 'Out of scope',
  Misleading = 'Misleading',
  PartlyFalse = 'Partly false',
  Inconclusive = 'Inconclusive'
}

export interface StatusFormat {
    name: string,
    value: number;
}
export interface StatusFormatPieChart {
    name: string,
    value: number;
    label: string;
}
export interface TicketsByAgentFormat {
    name: string,
    series: StatusFormat[]
}

interface BubbleChartItem {
  name: string,
  x: number,
  y?: number,
  r: number
}

export interface BubbleChartFormat {
    name: string,
    series: BubbleChartItem[]
}

export interface TicketCatResFormat {
  category: string;
  count: number;
}

export interface TicketResponseTime {
  category: string;
  count: number;
  day: string;
}

export enum ResTimeMinAvgLong {
  MIN = 100,
  AVG = 200,
  MAX = 500
}
