import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, switchMap } from 'rxjs/operators';
import { NotificationService } from '../../domain/notifications/notification.service';
import { environment } from '../../environments/environment';
import { NoopAction } from '../actions/app.actions';
import {
  ENotificationsActions,
  StartNotifications,
  ListNotifications,
  ListNotificationsFailure,
  ListNotificationsSuccess,
  ReadNotifications,
} from '../actions/notifications.actions';
import { UserExtraSaved } from '../actions/user-extra.actions';

@Injectable()
export class NotificationsEffects {
  constructor(
    private notificationService: NotificationService,
    private actions$: Actions
  ) {}

  @Effect()
  start = this.actions$.pipe(
    ofType<StartNotifications>(ENotificationsActions.StartNotifications),
    switchMap(() => {
      if (
        environment.notifications.enabled &&
        environment.notifications.timing > 0
      ) {
        return [
          new ListNotifications()
        ];
      }
      return [new NoopAction()];
    })
  );

  @Effect()
  list = this.actions$.pipe(
    ofType<ListNotifications>(ENotificationsActions.ListNotifications),
    switchMap(() => {
      return this.notificationService.list().pipe(
        switchMap(payload => [
          payload
            ? new ListNotificationsSuccess(payload)
            : new ListNotificationsFailure()
        ]),
        catchError(error => [new ListNotificationsFailure()])
      );
    }),
    catchError(error => [new ListNotificationsFailure()])
  );

  @Effect()
  readNotifications = this.actions$.pipe(
    ofType<ReadNotifications>(ENotificationsActions.ReadNotifications),
    switchMap(action => {
         return [
          new UserExtraSaved(action.payload)
        ];
    })
  );  
}
