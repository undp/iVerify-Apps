import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { LocationsService } from '../../locations/location.service';
import {
    APILocationByDomain,
    APILocationById,
    ELocationsActions,
    LocationFailure,
    LocationLoading,
    LocationSuccess,
} from '../actions/locations.actions';
import { Location } from '../../models/location';
@Injectable()
export class LocationsEffects {
    constructor(
        private locationService: LocationsService,
        private actions$: Actions
    ) {}

    @Effect()
    locationById: Observable<any> = this.actions$.pipe(
        ofType<APILocationById>(ELocationsActions.APILocationById),
        map((action) => action.payload),
        switchMap((payload) => {
            return this.locationService.getLocationById(payload).pipe(
                switchMap((payload) => [
                    payload
                        ? new LocationSuccess(payload)
                        : new LocationFailure(),
                ]),
                catchError((error) => {
                    console.error(error);
                    return [new LocationFailure()];
                })
            );
        }),
        catchError((error) => {
            console.error(error);
            return [new LocationFailure()];
        })
    );
}
