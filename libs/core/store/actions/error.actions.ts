import { Action } from '@ngrx/store';

export enum EApiErrorActions {
  ApiServerError = '[Error] API Server'
}

export class ApiServerError implements Action {
  readonly type = EApiErrorActions.ApiServerError;
  constructor(public payload: any) {}
}

export type ErrorAction = ApiServerError;
