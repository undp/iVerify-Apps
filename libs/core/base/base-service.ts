import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { StorageService } from '../storage/storage.service';
import { of, Observable } from 'rxjs';

const APP_STATE_KEY = environment.app_state_key;

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  constructor(public http?: HttpClient, public storageService?: StorageService) {}

  readonly uris = {};

  getUrl(uri: string, withAPIVersion: boolean = true) {
    return `${environment.api.base}/${
      withAPIVersion ? `api/${environment.api.version}/` : ''
    }${uri}`;
  }

  getParamsFromObject(object: any): HttpParams {
    return object
      ? Object.keys(object)
          .map(key => ({ key, value: object[key] }))
          .reduce((params, { key, value }) => {
            return params.set(key, value);
          }, new HttpParams())
      : null;
  }

  readAsBlob(url: string): Observable<Blob> {
    return this.http.get(url, {
      responseType: 'blob'
    });
  }

  cacheHandler(err: Error, key: string) {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 0  && err.statusText == 'Unknown Error') {
        let appData = this.storageService.get(APP_STATE_KEY);
        return of((appData[key])? appData[key][key]: null);
      }
    }
    return null;
  }
}


