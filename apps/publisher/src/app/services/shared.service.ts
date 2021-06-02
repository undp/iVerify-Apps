import { Injectable } from "@nestjs/common";
import { MeedanCheckClientService } from "libs/meedan-check-client/src/lib/meedan-check-client.service";
import { Observable, Subject } from "rxjs";
import { switchMap } from "rxjs/operators";

@Injectable()
export class SharedService{
    private _reportId: Subject<string> = new Subject<string>();
    report$: Observable<any> = this._reportId.pipe(switchMap(id => this.checkClient.getReport(id)))
    
    constructor(private checkClient: MeedanCheckClientService){}
    
    updateReportId(id: string){
        this._reportId.next(id);
    }


}