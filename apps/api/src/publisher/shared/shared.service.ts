import { Injectable, Scope } from '@nestjs/common';
import { MeedanCheckClientService } from '@iverify/meedan-check-client/src/lib/meedan-check-client.service';
import { Observable, Subject, combineLatest } from 'rxjs';
import { map, shareReplay, switchMap, take } from 'rxjs/operators';
import { CheckClientHandlerService } from '../../app/handlers/checkStatsClientHandler.service';

@Injectable()
export class SharedService {
    private _reportId: Subject<string> = new Subject<string>();
    private _locationId: Subject<string> = new Subject<string>();

    reportId$: Observable<string> = this._reportId
        .asObservable()
        .pipe(take(1), shareReplay(1));

    locationId$: Observable<string> = this._locationId
        .asObservable()
        .pipe(take(1), shareReplay(1));

    private _wpPost: Subject<any> = new Subject<any>();

    wpPost$: Observable<string> = this._wpPost
        .asObservable()
        .pipe(take(1), shareReplay(1));

    report$: Observable<any> = combineLatest([
        this.reportId$,
        this.locationId$,
    ]).pipe(
        map(([reportId, locationId]) => ({ reportId, locationId })),
        switchMap((data: any) =>
            this.checkClient.getReport(data.locationId, data.reportId)
        ),
        shareReplay(1)
    );

    meedanReport$: Observable<any> = combineLatest([
        this.reportId$,
        this.locationId$,
    ]).pipe(
        map(([reportId, locationId]) => ({ reportId, locationId })),
        switchMap((data: any) =>
            this.checkClient.getMeedanReport(data.locationId, data.reportId)
        ),
        shareReplay(1)
    );
    private sub = this.report$.subscribe();
    private wpPostSub = this.wpPost$.subscribe();

    constructor(private checkClient: CheckClientHandlerService) {}

    updateReportId(id: string) {
        this._reportId.next(id);
    }

    updateReportIdWithLocation(locationId: string, id: string) {
        this._reportId.next(id);
        this._locationId.next(locationId);
    }

    updateWpPost(locationId: string, wpPost: any) {
        this._wpPost.next(wpPost);
        this._locationId.next(locationId);
    }
}
