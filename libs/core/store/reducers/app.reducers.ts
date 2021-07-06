import { ActionReducerMap } from '@ngrx/store';
import { AppState } from '../states/app.state';
import { configReducers } from './config.reducers';
import { mapReducers } from './map.reducers';
import { permissionsReducers } from './permissions.reducers';
import { rolesReducers } from './roles.reducers';
import { routerReducer } from '@ngrx/router-store';
import { userPermissionsReducers } from './user-permissions.reducers';
import { userReducers } from './user.reducers';
import { tagsReducers } from './tags.reducers';
import { usersReducers } from './users.reducers';
import { formAttributesReducers } from './forn-attributes.reducers';
import { apiErrorReducer } from './error.reducers';
import { notificationsReducers } from './notifications.reducers';
import { userExtraReducers } from './user-extra.reducers';
import { networkStatusReducers } from './network-status.reducers';
import { exportReducers } from './export.reducers';
import { formsReducers } from './forms.reducers';

export const appReducers: ActionReducerMap<AppState, any> = {
  router: routerReducer,
  user: userReducers,
  userPermissions: userPermissionsReducers,
  config: configReducers,
  roles: rolesReducers,
  permissions: permissionsReducers,
  map: mapReducers,
  tags: tagsReducers,
  users: usersReducers,
  formAttributes: formAttributesReducers,
  apiError: apiErrorReducer,
  notifications: notificationsReducers,
  userExtra: userExtraReducers,
  networkStatus: networkStatusReducers,
  export: exportReducers,
  forms: formsReducers
};
