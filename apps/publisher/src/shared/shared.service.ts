import { Injectable, Scope } from '@nestjs/common';
import { MeedanCheckClientService } from 'libs/meedan-check-client/src/lib/meedan-check-client.service';
import { Observable, Observer, Subject } from 'rxjs';
import {
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

@Injectable()
export class SharedService {
  private _reportId: Subject<string> = new Subject<string>();
  private _report = new Subject<any>();
  private _meedanReport = new Subject<any>();

  reportId$: Observable<string> = this._reportId.asObservable().pipe(
    // take(1),
    tap((value) => console.log('Report ID emitted:', value)),
    shareReplay(1)
  );

  report$: Observable<any> = this._report
    .asObservable()
    .pipe(tap((report) => console.log('Report emitted:', JSON.stringify(report))));

  meedanReport$: Observable<any> = this._meedanReport
    .asObservable()
    .pipe(tap((meedanReport) => console.log('Meedan Report Emitted:', JSON.stringify(meedanReport))));

  private _wpPost: Subject<any> = new Subject<any>();
  wpPost$: Observable<string> = this._wpPost
    .asObservable()
    .pipe(take(1), shareReplay(1));

  private fetchReportObserver = this.reportId$
    .pipe(
      tap((id) => console.log('Report initialized with id:', id)),
      tap((id) => console.log('Report Fetching...')),
      switchMap((id) => this.checkClient.getReport(id)),
      tap((report) => console.log('Updating report--->')),
      tap((report) => this._report.next(report))
      // shareReplay(1)
    )
    .subscribe();
    
    private meedanReportObserver = this.reportId$
    .pipe(
      tap((id) => console.log('Meedan Report initialized with id', id)),
      tap((id) => console.log('Meedan Report Fetching...')),
      switchMap((id) => this.checkClient.getMeedanReport(id)),
      tap((meedanReport) => console.log('Updating meedan report--->')),
      tap((meedanReport) => this._meedanReport.next(meedanReport))
      // shareReplay(1)
    )
    .subscribe();

  private rID = this.reportId$.subscribe({
    next: (value) => {
      console.log(value);
    },
  });

  constructor(private checkClient: MeedanCheckClientService) {}

  updateReportId(id: string) {
    console.log('updateReportId', id);
    this._reportId.next(id);
  }

  updateWpPost(wpPost: any) {
    this._wpPost.next(wpPost);
  }
}
