import { createSelector } from '@ngrx/store';
import { AppState } from '../states/app.state';
import { UserState } from '../states/user.state';

const userState = (state: AppState) => state.user;

export const selectUser = createSelector(
  userState,
  (state: UserState) => state.user
);
