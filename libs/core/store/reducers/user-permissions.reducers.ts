import { AuthActions, EAuthActions } from '../actions/auth.actions';
import {
  UserPermissionsState,
  initialUserPermissionsState
} from '../states/user-permissions.state';

export function userPermissionsReducers(
  state = initialUserPermissionsState,
  action: AuthActions
): UserPermissionsState {
  switch (action.type) {
    case EAuthActions.SetUserPermissions: {
      return {
        ...state,
        userPermissions: action.payload
      };
    }

    case EAuthActions.ClearUserPermissions: {
      return {
        ...state,
        userPermissions: null
      };
    }

    default:
      return state;
  }
}
