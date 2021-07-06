import { createSelector } from '@ngrx/store';
import { AppState } from '../states/app.state';
import { NetworkStatusState } from '../states/network-status.state';

const networkStatusState = (state: AppState) => state.networkStatus;

export const selectNetworkStatus = createSelector(
  networkStatusState,
  (state: NetworkStatusState) => state.networkStatus
);
