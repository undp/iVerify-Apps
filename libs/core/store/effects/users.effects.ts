import { Injectable } from '@angular/core';
import { UserService } from '@eview/core/users/user.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import {
  EUsersActions,
  ListUsers,
  ListUsersFailure,
  ListUsersSuccess
} from '../actions/users.actions';

@Injectable()
export class UsersEffects {
  constructor(private userService: UserService, private actions$: Actions) {}

  @Effect()
  list: Observable<any> = this.actions$.pipe(
    ofType<ListUsers>(EUsersActions.ListUsers),
    switchMap(() => {
      const listOption = {
        offset: 0,
        limit: 20,
      }; 
      return this.userService.list(listOption).pipe(
        switchMap(payload => [
          payload ? new ListUsersSuccess(payload) : new ListUsersFailure()
        ]),
        catchError(error => {
          console.error(error);
          return [new ListUsersFailure()];
        })
      );
    }),
    catchError(error => {
      console.error(error);
      return [new ListUsersFailure()];
    })
  );
}
