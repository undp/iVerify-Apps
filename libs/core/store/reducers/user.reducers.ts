import { AuthActions, EAuthActions } from '../actions/auth.actions';
import { UserState, initialUserState } from '../states/user.state';

export function userReducers(
  state = initialUserState,
  action: AuthActions
): UserState {
  switch (action.type) {
    case EAuthActions.LoginSuccess:
    case EAuthActions.GetCurrentUserSuccess: {
      return {
        ...state,
        user: action.payload
      };
    }

    case EAuthActions.LoginFailure:
    case EAuthActions.GetCurrentUserFailure:
    case EAuthActions.LogoutSuccess: {
      return {
        ...state,
        user: null
      };
    }

    default:
      return state;
  }
}
