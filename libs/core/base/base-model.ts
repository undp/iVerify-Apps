import { AllowedPriviledge } from '../auth/auth';
import { OrderSort } from '../models/commons';

export interface BaseModel {
  id: number | string;
  url?: string;
  allowed_privileges?: AllowedPriviledge[];
}

export interface BaseModelArray<T extends BaseModel> {
  count: number;
  results: T[];
}

export interface BaseModelPagedArray<T extends BaseModel>
  extends BaseModelArray<T> {
  limit?: string;
  offset?: string;
  order?: OrderSort;
  orderby?: string;
  curr?: string;
  next?: string;
  prev?: string;
  total_count?: number;
}

export interface BaseModelPagedRequest {
  offset?: number;
  limit?: number;
  orderby?: string;
  order?: OrderSort;
}
