import {
  initialNetworkStatusState,
  NetworkStatusState
} from '../states/network-status.state';
import {
  ENetworkStatusActions,
  NetworkStatusActions
} from '../actions/network-status.actions';

export function networkStatusReducers(
  state = initialNetworkStatusState,
  action: NetworkStatusActions
): NetworkStatusState {
  switch (action.type) {
    case ENetworkStatusActions.CheckNetworkStatusSuccess: {
      return {
        ...state,
        networkStatus: action.payload
      };
    }

    case ENetworkStatusActions.UpdateNetworkStatus: {
      return {
        ...state,
        networkStatus: action.payload
      };
    }

    case ENetworkStatusActions.CheckNetworkStatusFailure: {
      return {
        ...state,
        networkStatus: null
      };
    }

    default:
      return state;
  }
}
