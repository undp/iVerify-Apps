import { Location } from '../../models/location';

export interface LocationState {
  location: Location | null;
  loading: boolean;
}

export const initialLocationState: LocationState = {
  location: null,
  loading: false,
};
