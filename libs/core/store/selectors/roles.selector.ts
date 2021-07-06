import { AppState } from '../states/app.state';
import { RolesState } from '../states/roles.state';
import { createSelector } from '@ngrx/store';

const rolesState = (state: AppState) => state.roles;

export const selectRoles = createSelector(
  rolesState,
  (state: RolesState) => state.roles
);
