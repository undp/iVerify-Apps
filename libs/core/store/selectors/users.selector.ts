import { createSelector } from '@ngrx/store';
import { AppState } from '../states/app.state';
import { UsersState } from '../states/users.state';

const usersState = (state: AppState) => state.users;

export const selectUsers = createSelector(
  usersState,
  (state: UsersState) => state.users
);
