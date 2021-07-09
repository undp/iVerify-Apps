import { Injectable } from '@angular/core';
import { environment } from '@iverify/core/environments/environment';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { EAppActions, UserLoggedIn } from '../actions/app.actions';
import { GetPermissions, GetRoles } from '../actions/auth.actions';
import { ListUsers } from '../actions/users.actions';
import { AuthEffects } from './auth.effects';
import { PermissionsEffects } from './permissions.effects';
import { RolesEffects } from './roles.effects';
import { UsersEffects } from './users.effects';



@Injectable()
export class AppEffects {
  constructor(private actions$: Actions) {}

  @Effect()
  userLoggedIn: Observable<any> = this.actions$.pipe(
    ofType<UserLoggedIn>(EAppActions.UserLoggedIn),
    switchMap(payload => [
      new GetPermissions(),
      new GetRoles(),
      new ListUsers()
    ])
  );
}

export const appEffects = [
  AppEffects,
  AuthEffects,
  RolesEffects,
  PermissionsEffects,
  UsersEffects,
];
