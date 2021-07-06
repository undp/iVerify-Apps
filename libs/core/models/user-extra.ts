import {
  BaseModel,
  BaseModelPagedArray
} from '../base/base-model';

export interface UserExtra extends BaseModel {
  results: any;
}

export interface UserExtras extends BaseModelPagedArray<UserExtra> {}
