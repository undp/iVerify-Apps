import { Injectable, Scope } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { shareReplay, switchMap, take } from 'rxjs/operators';
import { CheckClientHandlerService } from '../../app/handlers/checkStatsClientHandler.service';

@Injectable({ scope: Scope.REQUEST })
export class SharedService {
    private _reportId: Subject<string> = new Subject<string>();
    private _report: Subject<{ locationId: string; reportId: string }> =
        new Subject<{ locationId: string; reportId: string }>();

    reportObject$: Observable<{ locationId: string; reportId: string }> =
        this._report.asObservable().pipe(take(1), shareReplay(1));

    private _wpPost: Subject<any> = new Subject<any>();

    wpPost$: Observable<string> = this._wpPost
        .asObservable()
        .pipe(take(1), shareReplay(1));

    report$: Observable<any> = this.reportObject$.pipe(
        switchMap((data: any) =>
            this.checkClient.getReport(data.locationId, data.reportId)
        ),
        shareReplay(1)
    );

    meedanReport$: Observable<any> = this.reportObject$.pipe(
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

    updateReportIdWithLocation(locationId: string, reportId: string) {
        this._report.next({ locationId, reportId });
    }

    updateWpPost(locationId: string, wpPost: any) {
        this._wpPost.next({ ...wpPost, locationId });
    }
}
