import { AllowedPriviledge } from '../auth/auth';
import { Permission } from '../auth/permission';
import { BaseModel, BaseModelArray } from '../base/base-model';
import { Permissions } from '../models/permissions';

export interface Roles extends BaseModelArray<RoleItem> {}

export interface RoleItem extends BaseModel {
  id: number,
  name: string,
  description: string,
  resource: object[],
  permissions?: Permission[]
}
