import { Action } from '@ngrx/store';
import { Users } from '../../../core/models/user';

export enum EUsersActions {
  ListUsers = '[Users] List',
  ListUsersSuccess = '[Users] List success',
  ListUsersFailure = '[Users] List failure'
}

export class ListUsers implements Action {
  readonly type = EUsersActions.ListUsers;
}

export class ListUsersSuccess implements Action {
  readonly type = EUsersActions.ListUsersSuccess;
  constructor(public payload: Users) {}
}

export class ListUsersFailure implements Action {
  readonly type = EUsersActions.ListUsersFailure;
}

export type UsersActions = ListUsers | ListUsersSuccess | ListUsersFailure;
