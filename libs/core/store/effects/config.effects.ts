import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  EConfigActions,
  GetConfig,
  GetConfigFailure,
  GetConfigSuccess
} from '../actions/config.actions';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { ConfigService } from '@eview/core/config/config.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ConfigEffects {
  constructor(
    private configService: ConfigService,
    private actions$: Actions
  ) {}

  @Effect()
  get: Observable<any> = this.actions$.pipe(
    ofType<GetConfig>(EConfigActions.GetConfig),
    switchMap(() => {
      return this.configService.get().pipe(
        switchMap(payload => [
          payload ? new GetConfigSuccess(payload) : new GetConfigFailure()
        ]),
        catchError(error => [new GetConfigFailure()])
      );
    }),
    catchError(error => [new GetConfigFailure()])
  );
}
