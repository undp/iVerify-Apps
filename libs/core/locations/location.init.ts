import { Inject, Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { AppState } from '../store/states/app.state';
import { LocationIdSuccess } from '../store/actions/locations.actions';
import { BaseService } from '../base/base-service';
import { HttpClient } from '@angular/common/http';

// https://stackoverflow.com/questions/41619443/how-to-call-an-rest-api-while-bootstrapping-angular-2-app
import { DOCUMENT, Location } from '@angular/common';
@Injectable()
export class LocationInitService {
    private hostname: string;
    private locationData: any;

    constructor(
        private store: Store<AppState>,
        private http: HttpClient,
        private baseService: BaseService,
        @Inject(DOCUMENT) private document: any
    ) {
        this.hostname = this.document.location.hostname;
    }

    get() {
        this.locationData = null;
        const promise = new Promise<void>((resolve, reject) => {
            const apiURL = this.baseService.getUrl(
                `locations/map/${this.hostname}`
            );
            this.http.get<Location>(apiURL).subscribe({
                next: (location: any) => {
                    this.store.dispatch(new LocationIdSuccess(location));
                    this.locationData = location;
                    resolve();
                },
                error: (err: any) => {
                    reject(err);
                },
                complete: () => {
                    console.log('complete');
                },
            });
        });
        return promise;
    }

    get getLocationData(): any {
        return this.locationData;
    }
}
