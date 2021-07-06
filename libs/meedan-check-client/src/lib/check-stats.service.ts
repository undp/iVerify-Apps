import { HttpException, HttpService, Injectable, Logger } from "@nestjs/common";
import { Observable } from "rxjs";
import { catchError, map, retry } from "rxjs/operators";
import { CheckClientConfig } from "./config";
import { CheckClientHelperService } from "./helper.service";

@Injectable()
export class CheckStatsService{
    private readonly logger = new Logger('MeedanCheckClient');

    constructor(
        private http: HttpService, 
        private config: CheckClientConfig,
        private helper: CheckClientHelperService
        ){}

    getTicketsByAgent(startDate: Date, endDate: Date): Observable<any>{
        const query: string = this.helper.buildTicketsByAgentQuery(startDate, endDate);
        const headers = this.config.headers;
        return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
            map(res => res.data.data),
            retry(3),
            catchError(err => {
            this.logger.error('Error getting tickets by agent: ', err.message)
            throw new HttpException(err.message, 500);
            })
        );          
    }

    getTicketsByTag(startDate: Date, endDate: Date): Observable<any>{
        const query: string = this.helper.buildTicketsByAgentQuery(startDate, endDate);
        const headers = this.config.headers;
        return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
            map(res => res.data.data),
            retry(3),
            catchError(err => {
                this.logger.error('Error getting tickets by agent: ', err.message)
                throw new HttpException(err.message, 500);
            })
        );
    };

    getTicketsByStatus(startDate: Date, endDate: Date): Observable<any>{
        const query: string = this.helper.buildTicketsByStatusQuery(startDate, endDate);
        const headers = this.config.headers;
        return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
            map(res => res.data.data),
            retry(3),
            catchError(err => {
            this.logger.error('Error getting tickets by agent: ', err.message)
            throw new HttpException(err.message, 500);
            })
        );
    };

    getTicketsBySource(startDate: Date, endDate: Date): Observable<any>{
        const query: string = this.helper.buildTicketsBySourceQuery(startDate, endDate);
        const headers = this.config.headers;
        return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
            map(res => res.data.data),
            retry(3),
            catchError(err => {
            this.logger.error('Error getting tickets by source: ', err.message)
            throw new HttpException(err.message, 500);
            })
        );
    };

    getTicketsByType(startDate: Date, endDate: Date): Observable<any>{
        const query: string = this.helper.buildTicketsByTypeQuery(startDate, endDate);
        const headers = this.config.headers;
        return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
            map(res => res.data.data),
            retry(3),
            catchError(err => {
            this.logger.error('Error getting tickets by type: ', err.message)
            throw new HttpException(err.message, 500);
            })
        );
    };

    getTicketsByChannel(startDate: Date, endDate: Date): Observable<any>{
        const query: string = this.helper.buildTicketsByChannelQuery(startDate, endDate);
        const headers = this.config.headers;
        return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
            map(res => res.data.data),
            retry(3),
            catchError(err => {
            this.logger.error('Error getting tickets by channel: ', err.message)
            throw new HttpException(err.message, 500);
            })
        );
    };

    getCreatedVsPublished(startDate: Date, endDate: Date): Observable<any>{
        const query: string = this.helper.buildCreatedVsPublishedQuery(startDate, endDate);
        const headers = this.config.headers;
        return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
            map(res => res.data.data),
            retry(3),
            catchError(err => {
            this.logger.error('Error getting tickets created vs published: ', err.message)
            throw new HttpException(err.message, 500);
            })
        );
    };
}