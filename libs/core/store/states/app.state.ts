import { ConfigState, initialConfigState } from './config.state';
import { PermissionsState, initialPermissionsState } from './permissions.state';
import { RolesState, initialRolesState } from './roles.state';
import {
  UserPermissionsState,
  initialUserPermissionsState
} from './user-permissions.state';
import { UserState, initialUserState } from './user.state';
import { RouterReducerState } from '@ngrx/router-store';
import { UsersState, initialUsersState } from './users.state';

export interface AppState {
  router?: RouterReducerState;
  user: UserState;
  userPermissions: UserPermissionsState;
  roles: RolesState;
  permissions: PermissionsState;
  users: UsersState;
}

export const initialAppState: AppState = {
  user: initialUserState,
  userPermissions: initialUserPermissionsState,
  roles: initialRolesState,
  permissions: initialPermissionsState,
  users: initialUsersState,
};

export function getInitialState(): AppState {
  return initialAppState;
}
