import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  EAuthActions,
  GetPermissions,
  GetPermissionsFailure,
  GetPermissionsSuccess
} from '../actions/auth.actions';
import { catchError, switchMap } from 'rxjs/operators';

import { AuthService } from '@iverify/core/auth';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionsEffects {
  constructor(private authService: AuthService, private actions$: Actions) {}

  @Effect()
  get: Observable<any> = this.actions$.pipe(
    ofType<GetPermissions>(EAuthActions.GetPermissions),
    switchMap(() => {
      return this.authService.permissions().pipe(
        switchMap(payload => [
          payload
            ? new GetPermissionsSuccess(payload)
            : new GetPermissionsFailure()
        ]),
        catchError(error => [new GetPermissionsFailure()])
      );
    }),
    catchError(error => [new GetPermissionsFailure()])
  );
}
