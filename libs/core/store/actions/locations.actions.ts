import { Action } from '@ngrx/store';
import { Location } from '../../models/location';

export enum ELocationsActions {
    APILocationByDomain = '[Location] API APILocationByDomain',

    LocationLoading = '[Location] loading',
    LocationSuccess = '[Location] success',
    LocationFailure = '[Location] failure',
}

export class APILocationByDomain implements Action {
    readonly type = ELocationsActions.APILocationByDomain;
    constructor(public payload: string) {}
}

export class LocationLoading implements Action {
    readonly type = ELocationsActions.LocationLoading;
    constructor(public payload: boolean) {}
}

export class LocationSuccess implements Action {
    readonly type = ELocationsActions.LocationSuccess;
    constructor(public payload: Location) {}
}

export class LocationFailure implements Action {
    readonly type = ELocationsActions.LocationFailure;
}

export type LocationsActions =
    | LocationLoading
    | LocationSuccess
    | LocationFailure;
