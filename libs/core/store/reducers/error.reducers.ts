import { EApiErrorActions, ErrorAction } from '../actions/error.actions';
import { ErrorState, initialErrorState } from '../states/error.state';

export function apiErrorReducer(
  state = initialErrorState,
  action: ErrorAction
): ErrorState {
  switch (action.type) {
    case EApiErrorActions.ApiServerError: {
      return {
        ...state,
        ...action.payload
      };
    }
    default:
      return state;
  }
}
