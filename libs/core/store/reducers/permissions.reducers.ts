import { AuthActions, EAuthActions } from '../actions/auth.actions';
import {
  PermissionsState,
  initialPermissionsState
} from '../states/permissions.state';

export function permissionsReducers(
  state = initialPermissionsState,
  action: AuthActions
): PermissionsState {
  switch (action.type) {
    case EAuthActions.GetPermissionsSuccess: {
      return {
        ...state,
        permissions: action.payload
      };
    }

    case EAuthActions.GetPermissionsFailure:
    case EAuthActions.ClearPermissions: {
      return {
        ...state,
        permissions: null
      };
    }

    default:
      return state;
  }
}
