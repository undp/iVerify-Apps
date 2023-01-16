import { createSelector } from '@ngrx/store';
import { AppState } from '../states/app.state';
import { LocationState } from '../states/locations.state';

const locationState = (state: AppState) => state.domainLocation;

export const selectLocationData = createSelector(
    locationState,
    (state: LocationState) => state.locationData
);

export const selectLocation = createSelector(
    locationState,
    (state: LocationState) => state.locationById
);

export const selectLocationLoading = createSelector(
    locationState,
    (state: LocationState) => state.loading
);
