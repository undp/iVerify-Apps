import { Permission } from '../auth/permission';
import { BaseModel, BaseModelArray, BaseModelPagedRequest, BaseModelPagedArray } from '../base/base-model';

export interface RoleItem extends BaseModel {
  id: number,
  name: string,
  description: string,
  resource: object[],
  createdBy?: number,
  updatedBy?: number,
  permissions?: Permission[]
}

export interface RoleRequest {
  name: string,
  description: string,
  resource: Resource[]
}
export interface Resource {
  name: string, 
  permissions: string[]
}
export interface ListRoleOptions extends BaseModelPagedRequest {
  q?: string;
}
export interface Roles extends BaseModelPagedArray<RoleItem> {
  data?: RoleItem[];
}

