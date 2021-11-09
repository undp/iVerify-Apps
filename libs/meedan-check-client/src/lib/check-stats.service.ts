import { HttpException, HttpService, Injectable, Logger } from "@nestjs/common";
import { from, Observable } from "rxjs";
import { catchError, concatMap, map, reduce, retry } from "rxjs/operators";
import { CheckClientConfig } from "./config";
import { CheckClientHelperService } from "./helper.service";
import { StatusesMap } from "@iverify/iverify-common";

@Injectable()
export class CheckStatsService{
    private readonly logger = new Logger('MeedanCheckClient');

    constructor(
        private http: HttpService, 
        private config: CheckClientConfig,
        private helper: CheckClientHelperService
        ){}

    getTicketsByAgent(startDate: string, endDate: string): Observable<any>{
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

    getTicketsByTags(startDate: string, endDate: string): Observable<any>{
        const team = this.config.checkApiTeam;
        const headers = this.config.headers;
        const query = this.helper.buildTeamTagsQuery(team);
        return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
            map(res => res.data.data.team.tag_texts.edges.map(node => node.node.text)),
            retry(3),
            concatMap(tags => from(tags)),
            concatMap(tag => this.getTicketsByTag(startDate, endDate, tag)),
            reduce((acc, val) => ([...acc, val]), []),
            catchError(err => {
            this.logger.error('Error getting tickets by agent: ', err.message)
            throw new HttpException(err.message, 500);
            })
        );
    }

    getTicketsByTag(startDate: string, endDate: string, tag): Observable<any>{
        const query: string = this.helper.buildTicketsByTagQuery(startDate, endDate, tag);
        const headers = this.config.headers;
        return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
            map(res => ({...res.data.data, tag})),
            retry(3),
            catchError(err => {
                this.logger.error('Error getting tickets by tag: ', err.message)
                throw new HttpException(err.message, 500);
            })
        );
    };

    getTicketsByStatuses(startDate: string, endDate: string): Observable<any>{
        const statuses = StatusesMap.map(i => i.value);
        return from(statuses).pipe(
            concatMap(status => this.getTicketsByStatus(startDate, endDate, status)),
            reduce((acc, val) => ([...acc, val]), [])
        )
    }

    getTicketsByStatus(startDate: string, endDate: string, status: string): Observable<any>{
        const query: string = this.helper.buildTicketsByStatusQuery(startDate, endDate, status);
        const headers = this.config.headers;
        return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
            map(res => ({...res.data.data, status})),
            retry(3),
            catchError(err => {
                this.logger.error('Error getting tickets by status: ', err.message)
                throw new HttpException(err.message, 500);
            })
        );
    };

    getTicketsBySource(startDate: string, endDate: string): Observable<any>{
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

    getTicketsByType(startDate: string, endDate: string): Observable<any>{
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

    getTicketsByChannel(startDate: string, endDate: string): Observable<any>{
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

    getCreatedVsPublished(startDate: string, endDate: string): Observable<any>{
        return from(['published', 'unpublished']).pipe(
            concatMap(status => this.getCreatedOrPublished(startDate, endDate, status)),
            reduce((acc, val) => ([...acc, val]), [])
        )
    }

    getCreatedOrPublished(startDate: string, endDate: string, status: string): Observable<any>{
        const query: string = this.helper.buildCreatedVsPublishedQuery(startDate, endDate, status);
        const headers = this.config.headers;
        return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
            map(res => ({...res.data.data, status})),
            retry(3),
            catchError(err => {
            this.logger.error('Error getting tickets created vs published: ', err.message)
            throw new HttpException(err.message, 500);
            })
        );
    };

    getTicketLastStatus(id: string){
        const query: string = this.helper.buildTicketLastStatusQuery(id);
        const headers = this.config.headers;
        return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
            map(res => res.data.data),
            retry(3),
            catchError(err => {
            this.logger.error('Error getting ticket last status: ', err.message)
            throw new HttpException(err.message, 500);
            })
        );
    }
}