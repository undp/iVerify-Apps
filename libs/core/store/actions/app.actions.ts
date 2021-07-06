import { Action } from '@ngrx/store';

export enum EAppActions {
  Noop = '[App] Noop',
  UserLoggedIn = '[App] User logged in',
  UserLoggedOut = '[App] User logged out'
}

export class NoopAction implements Action {
  readonly type = EAppActions.Noop;
}

export class UserLoggedIn implements Action {
  readonly type = EAppActions.UserLoggedIn;
}

export class UserLoggedOut implements Action {
  readonly type = EAppActions.UserLoggedOut;
}

export type AppActions = UserLoggedIn | UserLoggedOut;
