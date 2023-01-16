import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { LocationsService } from '../../locations/location.service';
import {
    APILocationByDomain,
    ELocationsActions,
    LocationFailure,
    LocationSuccess,
} from '../actions/locations.actions';

@Injectable()
export class LocationsEffects {
    constructor(
        private locationService: LocationsService,
        private actions$: Actions
    ) {}

    @Effect()
    locationByDomain: Observable<Location> = this.actions$.pipe(
        ofType<APILocationByDomain>(ELocationsActions.APILocationByDomain),
        map((action) => action.payload),
        switchMap((payload) => {
            return this.locationService.getLocationByDomain(payload).pipe(
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
