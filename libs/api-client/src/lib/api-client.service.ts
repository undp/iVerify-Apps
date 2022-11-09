import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ApiClientConfig } from './config';
import { Article } from '@iverify/iverify-common';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ApiClientService {
    private readonly logger = new Logger(ApiClientService.name);

    constructor(private http: HttpService, private config: ApiClientConfig) {}

    postArticle(article: Partial<Article>): Observable<any> {
        return this.http.post(this.config.postArticleUrl, { article }).pipe(
            retry(3),
            catchError((err) => {
                this.logger.error('Error posting article: ', err.message);
                throw new HttpException(err.message, 500);
            })
        );
    }

    postToxicStats(toxicCount: number): Observable<any> {
        return this.http
            .post(this.config.postToxicStatsUrl, { toxicCount })
            .pipe(
                retry(3),
                catchError((err) => {
                    this.logger.error('Error posting article: ', err.message);
                    throw new HttpException(err.message, 500);
                })
            );
    }
}
