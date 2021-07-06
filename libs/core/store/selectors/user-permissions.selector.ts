import { AppState } from '../states/app.state';
import { UserPermissionsState } from '../states/user-permissions.state';
import { createSelector } from '@ngrx/store';

const userPermissionsState = (state: AppState) => state.userPermissions;

export const selectUserPermissions = createSelector(
  userPermissionsState,
  (state: UserPermissionsState) => state.userPermissions
);
