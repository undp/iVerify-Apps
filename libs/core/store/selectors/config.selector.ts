import { AppState } from '../states/app.state';
import { ConfigState } from '../states/config.state';
import { createSelector } from '@ngrx/store';

const configState = (state: AppState) => state.config;

export const selectConfig = createSelector(
  configState,
  (state: ConfigState) => state.config
);
