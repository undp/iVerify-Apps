import { AuthActions, EAuthActions } from '../actions/auth.actions';
import { RolesState, initialRolesState } from '../states/roles.state';

export function rolesReducers(
  state = initialRolesState,
  action: AuthActions
): RolesState {
  switch (action.type) {
    case EAuthActions.GetRolesSuccess: {
      return {
        ...state,
        roles: action.payload
      };
    }

    case EAuthActions.GetRolesFailure:
    case EAuthActions.ClearRoles: {
      return {
        ...state,
        roles: null
      };
    }

    default:
      return state;
  }
}
