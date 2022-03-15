import { AllowedPriviledge } from '../auth/auth';
import { Permission } from '../auth/permission';
import { BaseModel, BaseModelArray } from '../base/base-model';

export interface Permissions extends BaseModelArray<PermissionItem> {}

export interface PermissionItem extends BaseModel {
  id: number;
  name: Permission;
  description: string;
}
