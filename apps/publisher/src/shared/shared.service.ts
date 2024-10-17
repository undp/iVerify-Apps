import { Injectable, Scope } from "@nestjs/common";
import { MeedanCheckClientService } from "libs/meedan-check-client/src/lib/meedan-check-client.service";
import { Observable, Subject } from "rxjs";
import { shareReplay, switchMap, take } from "rxjs/operators";

@Injectable()
export class SharedService{
    private _reportId: Subject<string> = new Subject<string>();
    reportId$: Observable<string> = this._reportId.asObservable().pipe(take(1), shareReplay(1));

    private _wpPost: Subject<any> = new Subject<any>();
    wpPost$: Observable<string> = this._wpPost.asObservable().pipe(take(1), shareReplay(1));

    report$: Observable<any> = this.reportId$.pipe(
        switchMap(id => this.checkClient.getReport(id)),
        shareReplay(1)
        )
    meedanReport$: Observable<any> = this.reportId$.pipe(
        switchMap(id => this.checkClient.getMeedanReport(id)),
        shareReplay(1)
        )
    private sub = this.report$.subscribe();
    private wpPostSub = this.wpPost$.subscribe();


    constructor(private checkClient: MeedanCheckClientService){}

    updateReportId(id: string){
        this._reportId.next(id);
    }

    updateWpPost(wpPost: any){
        this._wpPost.next(wpPost);
    }


}
