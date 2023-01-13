import { Location } from '../../models/location';

export interface LocationState {
    locationData: Location | null;
    loading: boolean;
}

export const initialLocationState: LocationState = {
    locationData: null,
    loading: false,
};
