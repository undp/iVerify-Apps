import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';
import { CheckClientHelperService } from './helper.service';
import { CheckApiConfig } from './interfaces/check-api.config';
import { ToxicityScores } from './interfaces/toxicity-scores';

@Injectable()
export class MeedanCheckClientService {
    private readonly logger = new Logger(MeedanCheckClientService.name);

    constructor(
        private http: HttpService,
        private helper: CheckClientHelperService
    ) {}

    getReport(config: CheckApiConfig, id: string): Observable<any> {
        const query: string = this.helper.buildGetReportQuery(id);
        const headers = config.headers;
        console.log('Getting report query: ', query);
        return this.http.post(config.checkApiUrl, { query }, { headers }).pipe(
            tap((res: any) =>
                console.log('Getting report res: ', JSON.stringify(res.data))
            ),
            map((res: any) => {
                return {
                    report: res.data.data.project_media,
                    locationId: res.config.headers.locationId,
                };
            }),
            retry(3),
            catchError((err) => {
                this.logger.error('Error getting report by id: ', err.message);
                throw new HttpException(err.message, 500);
            })
        );
    }

    getMeedanReport(config: CheckApiConfig, id: string): Observable<any> {
        const query: string = this.helper.buildGetMeedanReportQuery(id);
        const headers = config.headers;
        console.log('Getting meedan report query: ', query);
        return this.http.post(config.checkApiUrl, { query }, { headers }).pipe(
            tap((res: any) =>
                console.log(
                    'Getting meedan report res: ',
                    JSON.stringify(res.data)
                )
            ),
            map((res: any) => {
                return {
                    locationId: res.config.headers.locationId,
                    report: res.data.data.project_media.annotation.data.options,
                };
            }),
            retry(3),
            catchError((err) => {
                this.logger.error(
                    'Error getting meedan report by id: ',
                    err.message
                );
                throw new HttpException(err.message, 500);
            })
        );
    }

    getReportWithQuery(config: CheckApiConfig, query: string): Observable<any> {
        const headers = config.headers;
        return this.http.post(config.checkApiUrl, { query }, { headers }).pipe(
            map((res: any) => res.data?.data?.project_media),
            retry(3),
            catchError((err) => {
                this.logger.error('Error getting report by id: ', err.message);
                throw new HttpException(err.message, 500);
            })
        );
    }

    createItem(
        config: CheckApiConfig,
        url: string,
        toxicityScores: ToxicityScores
    ): Observable<any> {
        const folderId: number = +config.uploadFolderId;
        const set_tasks_responses: string =
            this.helper.buildTasksResponses(toxicityScores);
        const query: string = this.helper.buildCreateItemMutation(
            url,
            folderId,
            set_tasks_responses
        );
        const headers = config.headers;
        return this.http.post(config.checkApiUrl, { query }, { headers }).pipe(
            map((res: any) => res.data),
            retry(3),
            catchError((err) => {
                this.logger.error('Error creating item: ', err.message);
                return of({ error: err.message, url });
                // throw new HttpException(err.message, 500);
            })
        );
    }

    createItemFromWp(
        config: CheckApiConfig,
        url: string,
        content: string,
        wp_key = 'message_from_website'
    ): Observable<any> {
        const query: string = this.helper.buildCreateItemFromWPMutation(
            url,
            content,
            wp_key
        );
        console.log('query: ', query);
        const headers = config.headers;
        console.log('headers: ', headers);

        return this.http.post(config.checkApiUrl, { query }, { headers }).pipe(
            map((res: any) => res.data),
            retry(3),
            catchError((err) => {
                this.logger.error('Error creating item: ', err.message);
                return of({ error: err.message });
                // throw new HttpException(err.message, 500);
            })
        );
    }
}
