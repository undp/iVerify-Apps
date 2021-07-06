import {
  initialUserExtraState,
  UserExtraState
} from '../states/user-extra.state';
import {
  EUserExtraActions,
  UserExtraActions
} from '../actions/user-extra.actions';

export function userExtraReducers(
  state = initialUserExtraState,
  action: UserExtraActions
): UserExtraState {
  switch (action.type) {
    case EUserExtraActions.GetUserExtraFailure: {
      return {
        ...state,
        userExtra: null
      };
    }

    default:
      return state;
  }
}
