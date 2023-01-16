import { Location, LocationId } from '../../models/location';

export interface LocationState {
    locationData: LocationId | null;
    locationById: Location | null;
    loading: boolean;
}

export const initialLocationState: LocationState = {
    locationData: null,
    locationById: null,
    loading: false,
};
