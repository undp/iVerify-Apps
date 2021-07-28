import { Permission } from '../auth/permission';

export interface UserPermissions {
  isAdmin: boolean;
  permissions: Permission[];
}
