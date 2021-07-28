import { AllowedPriviledge } from '../auth/auth';
import { Permission } from '../auth/permission';
import { BaseModel, BaseModelArray } from '../base/base-model';

export interface Roles extends BaseModelArray<RoleItem> {}

export interface RoleItem extends BaseModel {
  id          : number;
  name        : string;
  short_name  : string;
  display_name: string;
  description : string;
  permissions : Permission[];
  protected   : boolean;
}
