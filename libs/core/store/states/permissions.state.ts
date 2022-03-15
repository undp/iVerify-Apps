import { Permissions } from '../../../core/models/permissions';

export interface PermissionsState {
  permissions: Permissions | null;
}

export const initialPermissionsState: PermissionsState = {
  permissions: null
};
