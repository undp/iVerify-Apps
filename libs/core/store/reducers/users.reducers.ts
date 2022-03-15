import { EUsersActions, UsersActions } from '../actions/users.actions';
import { initialUsersState, UsersState } from '../states/users.state';

export function usersReducers(
  state = initialUsersState,
  action: UsersActions
): UsersState {
  switch (action.type) {
    case EUsersActions.ListUsersSuccess: {
      return {
        ...state,
        users: action.payload
      };
    }

    case EUsersActions.ListUsersFailure: {
      return {
        ...state,
        users: null
      };
    }

    default:
      return state;
  }
}
