import {
    ELocationsActions,
    LocationsActions,
} from '../actions/locations.actions';
import { initialLocationState, LocationState } from '../states/locations.state';

export function locationsReducers(
    state = initialLocationState,
    action: LocationsActions
): LocationState {
    switch (action.type) {
        case ELocationsActions.LocationLoading: {
            return {
                ...state,
                loading: action.payload,
            };
        }

        case ELocationsActions.LocationIdSuccess: {
            return {
                ...state,
                locationData: action.payload,
            };
        }

        case ELocationsActions.LocationSuccess: {
            return {
                ...state,
                locationById: action.payload,
            };
        }

        case ELocationsActions.LocationFailure: {
            return {
                ...state,
                locationData: null,
            };
        }

        default:
            return state;
    }
}
