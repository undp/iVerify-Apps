import { UserPermissions } from '../../../core/models/user-permissions';

export interface UserPermissionsState {
  userPermissions: UserPermissions | null;
}

export const initialUserPermissionsState: UserPermissionsState = {
  userPermissions: null
};
