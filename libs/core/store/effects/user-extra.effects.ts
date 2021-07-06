import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, switchMap, take } from 'rxjs/operators';
import { UserExtraService } from '../../domain/userextra/user-extra.service';
import {
  EUserExtraActions,
  GetUserExtra,
  GetUserExtraFailure,
  UserExtraSaved,
  UserExtraSavedFailure
} from '../actions/user-extra.actions';
import {
  ReadNotificationsSaved,
} from '../actions/notifications.actions';

@Injectable()
export class UserExtraEffects {
  constructor(
    private userExtraService: UserExtraService,
    private actions$: Actions
  ) {}

  @Effect()
  savedUserExtra = this.actions$.pipe(
    ofType<UserExtraSaved>(EUserExtraActions.UserExtraSaved),
    switchMap(action => {
      // Form user_data to store
      const userData = {
        last_read_notification: action.payload.lastReadId
      };
      return this.userExtraService
        .saveUserExtra(userData)
        .pipe(
          switchMap(() => {
            return [
              new ReadNotificationsSaved({
                lastReadId: action.payload.lastReadId
              })
            ];
          }),
          catchError(error => [new UserExtraSavedFailure()])
        );
    })
  );

  @Effect()
  getUserExtra = this.actions$.pipe(
    ofType<GetUserExtra>(EUserExtraActions.GetUserExtra),
    switchMap(() => {
      return this.userExtraService.getUserExtra().pipe(
        switchMap(results => {
          // Extract last notification id from userExtra
          const lastReadId = results['user_data']
            ? JSON.parse(results['user_data']).last_read_notification
            : null;
          return [
            new ReadNotificationsSaved({
              lastReadId: lastReadId
            })
          ];
        }),
        catchError(error => [new GetUserExtraFailure()])
      );
    })
  );
}
