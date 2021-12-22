
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
  BAR = 'bar',
  LINE = 'line',
  PIE = 'pie',
  STACKED = 'stacked',
  BUBBLE = 'bubble',
  AREA_STACKED = 'area_stacked',
  VERTICAL_BAR_STACKED = 'vertical_bar_stacked'
}

export enum Statuses {
  InProgress = 'En curso',
  Unstarted = 'Sin iniciar',
  PreChecked = 'Pre-comprobado',
  False = 'Falso',
  True = 'Verdadero',
  OutOfScope = 'Fuera de perspectiva',
  Misleading = 'Misleading',
  PartlyFalse = 'Sostenible',
  Inconclusive = 'No confirmado',
  Completed = 'Terminada',
  Solved = 'Resuelto'
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

export let DataRange = {min: 0, avg: 0, max: 0};

