import { Action } from '@ngrx/store';
import { Config } from '../../../core/models/config';

export enum EConfigActions {
  GetConfig = '[Config] Get',
  GetConfigSuccess = '[Config] Get success',
  GetConfigFailure = '[Config] Get failure'
}

export class GetConfig implements Action {
  readonly type = EConfigActions.GetConfig;
}

export class GetConfigSuccess implements Action {
  readonly type = EConfigActions.GetConfigSuccess;
  constructor(public payload: Config) {}
}

export class GetConfigFailure implements Action {
  readonly type = EConfigActions.GetConfigFailure;
}

export type ConfigActions = GetConfig | GetConfigSuccess | GetConfigFailure;
