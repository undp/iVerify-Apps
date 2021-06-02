import { Injectable } from "@nestjs/common";
import { MeedanCheckClientService } from "libs/meedan-check-client/src/lib/meedan-check-client.service";
import { Observable, Subject } from "rxjs";
import { shareReplay, switchMap, take } from "rxjs/operators";

@Injectable()
export class SharedService{
    private _reportId: Subject<string> = new Subject<string>();
    private reportId$: Observable<string> = this._reportId.asObservable().pipe(take(1));
    report$: Observable<any> = this.reportId$.pipe(
        switchMap(id => this.checkClient.getReport(id)),   
        shareReplay(1)     
        )
    
    constructor(private checkClient: MeedanCheckClientService){}
    
    updateReportId(id: string){
        this._reportId.next(id);
    }


}
