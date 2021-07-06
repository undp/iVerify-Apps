import { AppState } from '../states/app.state';
import { MapState } from '../states/map.state';
import { createSelector } from '@ngrx/store';

const mapState = (state: AppState) => state.map;

export const selectMap = createSelector(
  mapState,
  (state: MapState) => state.map
);
