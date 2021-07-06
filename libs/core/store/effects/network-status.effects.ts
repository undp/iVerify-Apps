import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, switchMap, take } from 'rxjs/operators';
import { NetworkStatusService } from '../../domain/network/network-status.service';
import {
  ENetworkStatusActions,
  CheckNetworkStatusSuccess,
  CheckNetworkStatusFailure
} from '../actions/network-status.actions';

@Injectable()
export class NetworkStatusEffects {
  constructor(
    private networkstatusService: NetworkStatusService,
    private actions$: Actions
  ) {}

  @Effect()
  checkNetworkStatus = this.actions$.pipe(
    ofType<any>(ENetworkStatusActions.CheckNetworkStatus),
    switchMap(action => {
      return this.networkstatusService.checkNetworkStatus().pipe(
        switchMap(payload => {
          return [new CheckNetworkStatusSuccess(payload)];
        }),
        catchError(error => [new CheckNetworkStatusFailure()])
      );
    })
  );
}
