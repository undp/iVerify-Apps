import { Action } from '@ngrx/store';
import { AuthRequest } from '../../../core/auth/auth';
import { Permissions } from '../../../core/models/permissions';
import { Roles } from '../../../core/models/roles';
import { User } from '../../../core/models/user';
import { UserPermissions } from '../../../core/models/user-permissions';

export enum EAuthActions {
  Login = '[Auth] Login',
  LoginSuccess = '[Auth] Login success',
  LoginFailure = '[Auth] Login failure',
  Logout = '[Auth] Logout',
  LogoutSuccess = '[Auth] Logout success',
  TokenExpired = '[Auth] Token expired',
  GetCurrentUser = '[Auth] Get Current User',
  GetCurrentUserSuccess = '[Auth] Get Current User success',
  GetCurrentUserFailure = '[Auth] Get Current User failure',
  GetRoles = '[Auth] Get Roles',
  GetRolesSuccess = '[Auth] Get Roles success',
  GetRolesFailure = '[Auth] Get Roles failure',
  ClearRoles = '[Auth] Clear Roles',
  GetPermissions = '[Auth] Get Permissions',
  GetPermissionsSuccess = '[Auth] Get Permissions success',
  GetPermissionsFailure = '[Auth] Get Permissions failure',
  ClearPermissions = '[Auth] Clear Permissions',
  SetUserPermissions = '[Auth] Set User Permissions',
  ClearUserPermissions = '[Auth] Clear User Permissions'
}

export class Login implements Action {
  readonly type = EAuthActions.Login;
  constructor(public payload: AuthRequest = {}) {}
}

export class LoginSuccess implements Action {
  readonly type = EAuthActions.LoginSuccess;
  constructor(public payload: User) {}
}

export class LoginFailure implements Action {
  readonly type = EAuthActions.LoginFailure;
}

export class Logout implements Action {
  readonly type = EAuthActions.Logout;
}

export class LogoutSuccess implements Action {
  readonly type = EAuthActions.LogoutSuccess;
}

export class TokenExpired implements Action {
  readonly type = EAuthActions.TokenExpired;
}

export class GetCurrentUser implements Action {
  readonly type = EAuthActions.GetCurrentUser;
}

export class GetCurrentUserSuccess implements Action {
  readonly type = EAuthActions.GetCurrentUserSuccess;
  constructor(public payload: User) {}
}

export class GetCurrentUserFailure implements Action {
  readonly type = EAuthActions.GetCurrentUserFailure;
}

export class GetRoles implements Action {
  readonly type = EAuthActions.GetRoles;
}

export class GetRolesSuccess implements Action {
  readonly type = EAuthActions.GetRolesSuccess;
  constructor(public payload: Roles) {}
}

export class GetRolesFailure implements Action {
  readonly type = EAuthActions.GetRolesFailure;
}

export class ClearRoles implements Action {
  readonly type = EAuthActions.ClearRoles;
}

export class GetPermissions implements Action {
  readonly type = EAuthActions.GetPermissions;
}

export class GetPermissionsSuccess implements Action {
  readonly type = EAuthActions.GetPermissionsSuccess;
  constructor(public payload: Permissions) {}
}

export class GetPermissionsFailure implements Action {
  readonly type = EAuthActions.GetPermissionsFailure;
}

export class ClearPermissions implements Action {
  readonly type = EAuthActions.ClearPermissions;
}

export class SetUserPermissions implements Action {
  readonly type = EAuthActions.SetUserPermissions;
  constructor(public payload: UserPermissions) {}
}

export class ClearUserPermissions implements Action {
  readonly type = EAuthActions.ClearUserPermissions;
}

export type AuthActions =
  | Login
  | LoginSuccess
  | LoginFailure
  | Logout
  | LogoutSuccess
  | TokenExpired
  | GetCurrentUser
  | GetCurrentUserSuccess
  | GetCurrentUserFailure
  | GetRoles
  | GetRolesSuccess
  | GetRolesFailure
  | ClearRoles
  | GetPermissions
  | GetPermissionsSuccess
  | GetPermissionsFailure
  | ClearPermissions
  | SetUserPermissions
  | ClearUserPermissions;
