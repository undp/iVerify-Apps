import { AppState } from '../states/app.state';
import { ErrorState } from '../states/error.state';
import { createSelector } from '@ngrx/store';

const errorState = (state: AppState) => state.apiError;

export const selectApiError = createSelector(
  errorState,
  (state: ErrorState) => state
);
