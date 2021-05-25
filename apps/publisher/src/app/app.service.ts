import { Injectable } from '@nestjs/common';
import { MeedanCheckClientService } from 'libs/meedan-check-client/src/lib/meedan-check-client.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class AppService {
  constructor(private checkClient: MeedanCheckClientService){}
  getData(): { message: string } {
    return { message: 'Welcome to publisher!' };
  }

  publishReportById(id: string): Observable<any>{
    return this.checkClient.getReport(id);
    //future pipeline will be similar to:
    // .pipe(
    //   switchMap(report => this.iverifyClient.checkPublishingRules(report)),//check publications rules
    //   map(report => this.helper.tranformReportForWP(report)), // transform data
    //   switchMap(report => this.wordPressClient.publishReport(report)) // publish on wordpress
    //   )
  }
}
