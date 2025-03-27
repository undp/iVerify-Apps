import { Injectable, Logger, Scope } from '@nestjs/common';
import { MeedanCheckClientService } from 'libs/meedan-check-client/src/lib/meedan-check-client.service';
import { Observable, Subject } from 'rxjs';
import { shareReplay, switchMap, take, tap } from 'rxjs/operators';

@Injectable({ scope: Scope.REQUEST })
export class SharedService {
  constructor(private checkClient: MeedanCheckClientService) {}
  private _reportId: Subject<string> = new Subject<string>();
  private _report = new Subject<any>();
  private _meedanReport = new Subject<any>();
  private logger = new Logger("PublisherSharedService");

  reportId$: Observable<string> = this._reportId.asObservable().pipe(
    // take(1),
    tap((value) => this.logger.log(`Report ID emitted: ${value}`)),
    shareReplay(1)
  );

  report$: Observable<any> = this._report
    .asObservable()
    .pipe(
      tap((report) => this.logger.log(`Report emitted:${report}`))
    );

  meedanReport$: Observable<any> = this._meedanReport
    .asObservable()
    .pipe(
      tap((meedanReport) =>
        this.logger.log(`Meedan Report Emitted: ${meedanReport}`)
      )
    );

  private _wpPost: Subject<any> = new Subject<any>();
  wpPost$: Observable<string> = this._wpPost
    .asObservable()
    .pipe(take(1), shareReplay(1));

  private fetchReportObserver = this.reportId$
    .pipe(
      tap((id) => this.logger.log(`Report initialized with id: ${JSON.stringify(id)}`)),
      tap((id) => this.logger.log('Report Fetching...')),
      switchMap((id) => this.checkClient.getReport(id)),
      tap((report) => this._report.next(report))
      // shareReplay(1)
    )
    .subscribe();

  private meedanReportObserver = this.reportId$
    .pipe(
      tap((id) => this.logger.log(`Meedan Report initialized with id: ${JSON.stringify(id)}`)),
      tap((id) => this.logger.log('Meedan Report Fetching...')),
      switchMap((id) => this.checkClient.getMeedanReport(id)),
      tap((meedanReport) => this._meedanReport.next(meedanReport))
      // shareReplay(1)
    )
    .subscribe();

  private rID = this.reportId$.subscribe({
    next: (value) => {
        this.logger.log(value);
    },
  });

  updateReportId(id: string) {
    this._reportId.next(id);
  }

  updateWpPost(wpPost: any) {
    this._wpPost.next(wpPost);
  }
}
