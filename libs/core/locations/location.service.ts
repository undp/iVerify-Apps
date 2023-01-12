import { Injectable } from '@angular/core';
import { BaseService } from '../base/base-service';
import { Observable } from 'rxjs';
import { Location } from '../models/location';
@Injectable({
  providedIn: 'root',
})
export class LocationsService extends BaseService {
  readonly uris = {
    base: 'locations',
  };

  list(): Observable<Array<Location>> {
    return this.http.get<Array<Location>>(this.getUrl(this.uris.base));
  }

  getLocationByDomain(location: string): Observable<Location> {
    return this.http.get<Location>(
      `${this.getUrl(this.uris.base)}/${location}`
    );
  }
}
