import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { iif, Observable, of } from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators'
import { CheckClientConfig } from './config';
import { CheckClientHelperService } from './helper.service';
import { ToxicityScores } from './interfaces/toxicity-scores';

@Injectable()
export class MeedanCheckClientService {    

    constructor(
      private http: HttpService, 
      private config: CheckClientConfig,
      private helper: CheckClientHelperService
      ){}

  getReport(id: string): Observable<any> {
    const query: string = this.helper.buildGetReportQuery(id);
    const headers = this.config.headers;
    return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
      map(res => res.data.data.project_media),
      catchError(err => {
        throw new HttpException(err.message, 500);
      })
    );
  }

  createItem(url: string, toxicityScores: ToxicityScores): Observable<any>{
    const folderId: number = +this.config.uploadFolderId;
    const set_tasks_responses: string = this.helper.buildTasksResponses(toxicityScores);
    const query: string = this.helper.buildCreateItemMutation(url, folderId, set_tasks_responses);
    const headers = this.config.headers;
    return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
      map(res => res.data),
      tap(response => console.log('response: ', response)),
      catchError(err => {
        return of({data: err.message})
        // throw new HttpException(err.message, 500);
      })
    );
  }

  
}