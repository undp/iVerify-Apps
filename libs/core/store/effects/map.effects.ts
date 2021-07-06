import { Actions, Effect, ofType } from '@ngrx/effects';
import { EConfigActions, GetConfigSuccess } from '../actions/config.actions';

import { ConfigHelpers } from '@eview/core/config/config.helpers';
import { Injectable } from '@angular/core';
import { MapConfigItem } from '@eview/core/models/config';
import { Observable } from 'rxjs';
import { Position } from '@eview/core/models/map';
import { SetMapDefaults } from '../actions/map.actions';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class MapEffects {
  constructor(private actions$: Actions) {}

  @Effect()
  onGetConfig: Observable<any> = this.actions$.pipe(
    ofType<GetConfigSuccess>(EConfigActions.GetConfigSuccess),
    switchMap(action => {
      const mapConfig = ConfigHelpers.GetConfigItem<MapConfigItem>(
        MapConfigItem,
        action.payload
      );
      return [
        new SetMapDefaults({
          defaults: {
            lat: mapConfig.default_view.lat || 0,
            lon: mapConfig.default_view.lon || 0,
            zoom: mapConfig.default_view.zoom || 0
          }
        })
      ];
    })
  );
}
