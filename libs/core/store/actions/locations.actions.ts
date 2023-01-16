import { Action } from '@ngrx/store';
import { Location } from '../../models/location';

export enum ELocationsActions {
    APILocationByDomain = '[Location] API APILocationByDomain',
    LocationIdSuccess = '[Location] Location ID success',

    APILocationById = '[Location] API APILocationById',
    LocationSuccess = '[Location] success',
    LocationLoading = '[Location] loading',
    LocationFailure = '[Location] failure',
}

export class APILocationByDomain implements Action {
    readonly type = ELocationsActions.APILocationByDomain;
    constructor(public payload: string) {}
}

export class APILocationById implements Action {
    readonly type = ELocationsActions.APILocationById;
    constructor(public payload: string) {}
}

export class LocationLoading implements Action {
    readonly type = ELocationsActions.LocationLoading;
    constructor(public payload: boolean) {}
}

export class LocationIdSuccess implements Action {
    readonly type = ELocationsActions.LocationIdSuccess;
    constructor(public payload: Location) {}
}

export class LocationSuccess implements Action {
    readonly type = ELocationsActions.LocationSuccess;
    constructor(public payload: Location) {}
}

export class LocationFailure implements Action {
    readonly type = ELocationsActions.LocationFailure;
}

export type LocationsActions =
    | APILocationById
    | LocationIdSuccess
    | LocationLoading
    | LocationSuccess
    | LocationFailure;
