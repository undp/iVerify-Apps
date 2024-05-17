import { HttpException, HttpService, Injectable, Logger } from '@nestjs/common';
import { iif, Observable, of } from 'rxjs';
import {catchError, map, retry, switchMap, tap} from 'rxjs/operators'
import { CheckClientConfig } from './config';
import { CheckClientHelperService } from './helper.service';
import { ToxicityScores } from './interfaces/toxicity-scores';

@Injectable()
export class MeedanCheckClientService {    

  private readonly logger = new Logger('MeedanCheckClient');

    constructor(
      private http: HttpService, 
      private config: CheckClientConfig,
      private helper: CheckClientHelperService
      ){}

  getReport(id: string): Observable<any> {
    const query: string = this.helper.buildGetReportQuery(id);
    const headers = this.config.headers;
    console.log('Getting report query: ', query)
    return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
      tap(res => console.log('Getting report res: ', JSON.stringify(res.data))),
      map(res => res.data.data.project_media),
      retry(3),
      catchError(err => {
        this.logger.error('Error getting report by id: ', err.message)
        throw new HttpException(err.message, 500);
      })
    );
  }

  getMeedanReport(id: string): Observable<any> {
    const query: string = this.helper.buildGetMeedanReportQuery(id);
    const headers = this.config.headers;
    console.log('Getting meedan report query: ', query)
    return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
      tap(res => console.log('Getting meedan report res: ', JSON.stringify(res.data))),
      map(res => res.data.data.project_media.annotation.data.options[0] ? res.data.data.project_media.annotation.data.options[0] : res.data.data.project_media.annotation.data.options),
      retry(3),
      catchError(err => {
        this.logger.error('Error getting meedan report by id: ', err.message)
	console.log(query)
        console.log(err)
        throw new HttpException(err.message, 500);
      })
    );
  }

  getReportWithQuery(query: string): Observable<any> {
    const headers = this.config.headers;
    return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
      map(res => res.data.data.project_media),
      retry(3),
      catchError(err => {
        this.logger.error('Error getting report by id: ', err.message)
        throw new HttpException(err.message, 500);
      })
    );
  }

  createItem(url: string, toxicityScores: ToxicityScores): Observable<any>{
    const folderId: number = +this.config.uploadFolderId;
    const set_tasks_responses: string = this.helper.buildTasksResponses(toxicityScores);
    const query: string = this.helper.buildCreateItemMutation(url, folderId, set_tasks_responses, [this.config.checkCTTag]);
    const headers = this.config.headers;
    return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
      map(res => res.data),
      retry(3),
      catchError(err => {
        console.log(err)
        this.logger.error('Error creating item: ', err);
        return of({error: err.message, url})
        // throw new HttpException(err.message, 500);
      })
    );
  }

  createItemFromWp(url: string, content: string, wp_key='message_from_website'): Observable<any>{
    const query: string = this.helper.buildCreateItemFromWPMutation(url, content, wp_key, [this.config.checkWebTag]);
    console.log('query: ', query)
    const headers = this.config.headers;
    console.log('headers: ', headers)

    return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
      map(res => res.data),
      retry(3),
      catchError(err => {
        this.logger.error('Error creating item: ', err.message);
        return of({error: err.message})
        // throw new HttpException(err.message, 500);
      })
    );
  }

  
}
