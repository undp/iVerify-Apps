import { ConfigActions, EConfigActions } from '../actions/config.actions';
import { ConfigState, initialConfigState } from '../states/config.state';

export function configReducers(
  state = initialConfigState,
  action: ConfigActions
): ConfigState {
  switch (action.type) {
    case EConfigActions.GetConfigSuccess: {
      return {
        ...state,
        config: action.payload
      };
    }

    case EConfigActions.GetConfigFailure: {
      return {
        ...state,
        config: null
      };
    }

    default:
      return state;
  }
}
