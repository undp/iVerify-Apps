import { EMapActions, MapActions } from '../actions/map.actions';
import { MapState, initialMapState } from '../states/map.state';

export function mapReducers(
  state = initialMapState,
  action: MapActions
): MapState {
  switch (action.type) {
    case EMapActions.SetMapDefaults:
    case EMapActions.UserClickedMap:
    case EMapActions.SetMapRegion:
    case EMapActions.SetMapMarkers: {
      return {
        ...state,
        map: {
          ...state.map,
          ...action.payload
        }
      };
    }

    case EMapActions.ClearMapActual: {
      return {
        ...state,
        map: {
          ...state.map,
          actual: null
        }
      };
    }

    default:
      return state;
  }
}
