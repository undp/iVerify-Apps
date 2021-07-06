import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  EAuthActions,
  GetRoles,
  GetRolesFailure,
  GetRolesSuccess
} from '../actions/auth.actions';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { AuthService } from '@eview/core/auth';
import { Injectable } from '@angular/core';

@Injectable()
export class RolesEffects {
  constructor(private authService: AuthService, private actions$: Actions) {}

  @Effect()
  get: Observable<any> = this.actions$.pipe(
    ofType<GetRoles>(EAuthActions.GetRoles),
    switchMap(() => {
      return this.authService.roles().pipe(
        switchMap(payload => [
          payload ? new GetRolesSuccess(payload) : new GetRolesFailure()
        ]),
        catchError(error => [new GetRolesFailure()])
      );
    }),
    catchError(error => [new GetRolesFailure()])
  );
}
