import { AppState } from '../states/app.state';
import { PermissionsState } from '../states/permissions.state';
import { createSelector } from '@ngrx/store';

const permissionsState = (state: AppState) => state.permissions;

export const selectPermissions = createSelector(
  permissionsState,
  (state: PermissionsState) => state.permissions
);
