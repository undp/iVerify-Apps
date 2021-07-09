import { ActionReducerMap } from '@ngrx/store';
import { AppState } from '../states/app.state';
import { permissionsReducers } from './permissions.reducers';
import { rolesReducers } from './roles.reducers';
import { routerReducer } from '@ngrx/router-store';
import { userPermissionsReducers } from './user-permissions.reducers';
import { userReducers } from './user.reducers';
import { usersReducers } from './users.reducers';

export const appReducers: ActionReducerMap<AppState, any> = {
  router: routerReducer,
  user: userReducers,
  userPermissions: userPermissionsReducers,
  roles: rolesReducers,
  permissions: permissionsReducers,
  users: usersReducers
};
