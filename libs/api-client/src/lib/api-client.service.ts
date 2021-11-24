import { HttpException, HttpService, Injectable, Logger } from '@nestjs/common';
import { ApiClientConfig } from './config';
import { Article } from '@iverify/iverify-common';
import { Observable } from 'rxjs';
import {catchError, map, retry, switchMap, tap} from 'rxjs/operators'


@Injectable()
export class ApiClientService {    

  private readonly logger = new Logger('ApiClient');

    constructor(
      private http: HttpService, 
      private config: ApiClientConfig,
      ){}

  postArticle(article: Partial<Article>): Observable<any> {
    return this.http.post(this.config.postArticleUrl, {article}).pipe(
      map(res => res.data.data.project_media),
      retry(3),
      catchError(err => {
        this.logger.error('Error posting article: ', err.message)
        throw new HttpException(err.message, 500);
      })
    );
  }  
  
}