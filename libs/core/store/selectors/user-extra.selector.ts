import { createSelector } from '@ngrx/store';
import { AppState } from '../states/app.state';
import { UserExtraState } from '../states/user-extra.state';

const userExtraState = (state: AppState) => state.userExtra;

export const selectUsers = createSelector(
  userExtraState,
  (state: UserExtraState) => state.userExtra
);
