import { TasksLabels } from "@iverify/common/src";
import { HttpException, HttpService, Injectable, Logger } from "@nestjs/common";
import { combineLatest, from, Observable } from "rxjs";
import { catchError, concatMap, filter, first, map, reduce, retry, take, tap } from "rxjs/operators";
import { CheckClientConfig } from "./config";
import { CheckClientHelperService } from "./helper.service";
// import { StatusesMap, TasksLabels } from "@iverify/iverify-common";

@Injectable()
export class CheckStatsService{
    private readonly logger = new Logger('MeedanCheckClient');
    lang = process.env.language;

    constructor(
        private http: HttpService, 
        private config: CheckClientConfig,
        private helper: CheckClientHelperService
        ){}

    

    getTicketsByAgent(statuses: string[]): Observable<any>{
        const teamSlug = this.config.checkApiTeam;
        return this.getAllAgents(teamSlug).pipe(
            concatMap(agents => from(agents)),
            concatMap(agent => this.getByAgentAllStatuses(agent, statuses)),
            reduce((acc, val) => ([...acc, ...val]), []),
            catchError(err => {
                this.logger.error(`Error getting tickets by agents: `, err.message)
                throw new HttpException(err.message, 500);
            })
        )         
    }

    getByAgentAllStatuses(agent: any, statuses: string[]){
        return from(statuses).pipe(
            concatMap(status => this.getByAgentAndStatus(agent.id, status).pipe(
                map(count => ({agent: agent.name, status, count}))
            )),
            reduce((acc, val) => ([...acc, val]), []),
            catchError(err => {
                this.logger.error(`Error getting tickets by status for agent ${agent.name}: `, err.message)
                throw new HttpException(err.message, 500);
            })

        )
    }

    getByAgentAndStatus(agentId: number, status: string){
        const query: string = this.helper.buildGetByAgentAndStatus(agentId, status);
        const headers = this.config.headers;

        return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
            map(res => res.data.data.search.number_of_results),
            retry(3),
            catchError(err => {
            this.logger.error(`Error getting tickets for agentId ${agentId} and status ${status}: `, err.message)
            throw new HttpException(err.message, 500);
            })
        );  
    }

    getAllAgents(teamSlug: string){
        const query: string = this.helper.buildAllAgentsQuery(teamSlug);
        const headers = this.config.headers;
        return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
            map(res => res.data.data),
            map(res => this.helper.formatAllAgentsResponse(res)),
            retry(3),
            catchError(err => {
            this.logger.error('Error getting all agents: ', err.message)
            throw new HttpException(err.message, 500);
            })
        );  
    }

    getTicketsByInputProjects(){
        const team = this.config.checkApiTeam;
        return this.getAllProjects(team).pipe(
            concatMap(projects => from(projects)),
            filter(project => project['title'].startsWith('1 ')),
            concatMap(project => this.getCountByProject(project['id']).pipe(
                map(count => ({project: project['title'], count}))
            )),
            reduce((acc, val) => ([...acc, val]), []),
            catchError(err => {
                this.logger.error(`Error getting tickets by input projects: `, err.message)
                throw new HttpException(err.message, 500);
            })
        )
    }

    getTicketsByProjects(){
        const team = this.config.checkApiTeam;
        return this.getAllProjects(team).pipe(
            concatMap(projects => from(projects)),
            concatMap(project => this.getCountByProject(project['id']).pipe(
                map(count => ({project: project['title'], count}))
            )),
            reduce((acc, val) => ([...acc, val]), []),
            catchError(err => {
                this.logger.error(`Error getting tickets by input projects: `, err.message)
                throw new HttpException(err.message, 500);
            })
        )
    }

    getCountByProject(projectId: number){
        const query: string = this.helper.buildCountByProjectQuery(projectId);
        const headers = this.config.headers;

        return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
            map(res => res.data.data.search.number_of_results),
            retry(3),
            catchError(err => {
            this.logger.error(`Error getting tickets for projectId ${projectId}: `, err.message)
            throw new HttpException(err.message, 500);
            })
        );  
    }

    getAllProjects(teamSlug: string){
        const query: string = this.helper.buildAllProjectsQuery(teamSlug);
        const headers = this.config.headers;
        return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
            map(res => res.data.data),
            map(res => this.helper.formatAllProjectsResponse(res)),
            retry(3),
            catchError(err => {
            this.logger.error('Error getting all agents: ', err.message)
            throw new HttpException(err.message, 500);
            })
        );  
    }

    getTicketsByTags(): Observable<any>{
        const team = this.config.checkApiTeam;
        const headers = this.config.headers;
        const query = this.helper.buildTeamTagsQuery(team);
        return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
            map(res => res.data.data.team.tag_texts.edges.map(node => node.node.text)),
            retry(3),
            concatMap(tags => from(tags)),
            concatMap(tag => this.getTicketsByTag(tag)),
            reduce((acc, val) => ([...acc, val]), []),
            catchError(err => {
            this.logger.error('Error getting tickets by agent: ', err.message)
            throw new HttpException(err.message, 500);
            })
        );
    }

    getTicketsByTag(tag): Observable<any>{
        const query: string = this.helper.buildTicketsByTagQuery(tag);
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

    getTicketsByStatuses(statusesMap): Observable<any>{
        const statuses = statusesMap.map(i => i.value);
        return from(statuses).pipe(
            concatMap((status: string) => this.getTicketsByStatus(status)),
            reduce((acc, val) => ([...acc, val]), [])
        )
    }

    getTicketsByStatus(status: string): Observable<any>{
        const query: string = this.helper.buildTicketsByStatusQuery(status);
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

    getTicketsByViolationTypes(){
        // const violationTaskId = '7766';
        const violationTaskId = process.env.VIOLATION_TASK_ID;
        const taskResponses = [
            TasksLabels[this.lang].violation_disinfo,
            TasksLabels[this.lang].violation_misinfo,
            TasksLabels[this.lang].violation_hate_speech,
            TasksLabels[this.lang].violation_threat,
            TasksLabels[this.lang].violation_violence,
            TasksLabels[this.lang].violation_disinfo,
        ];

        return from(taskResponses).pipe(
            concatMap(violation => this.getTicketsByTaskType(violationTaskId, violation).pipe(
                map((result) => {
                    const count = result && result.search && result.search.number_of_results ?
                    result.search.number_of_results :
                    0;
                    return {violation, count}
                })
            )),
            reduce((acc, val) => ([...acc, val]), []),
            catchError(err => {
            this.logger.error('Error getting tickets by agent: ', err.message)
            throw new HttpException(err.message, 500);
            })
        )
    }

    getTicketsByTaskType(taskId: string, value: string): Observable<any>{
        const query: string = this.helper.buildTicketsByTaskTypeQuery(taskId, value);
        const headers = this.config.headers;
        return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
            map(res => res.data.data),
            retry(3),
            catchError(err => {
            this.logger.error('Error getting tickets by type: ', err.message)
            throw new HttpException(err.message, 500);
            })
        );
    }

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

    getCreatedVsPublished(): Observable<any>{
        return from(['published', 'unpublished']).pipe(
            concatMap(status => this.getCreatedOrPublished(status)),
            reduce((acc, val) => ([...acc, val]), [])
        )
    }

    // getCreatedVsPublished(): Observable<any>{
    //     const publishedFolderId = +this.config.checkPublishFolder;
    //     return combineLatest([this.getAllMedias(), this.getCountByProject(publishedFolderId)]).pipe(
    //         map(([created, published]) => ({created, published}))
    //     )
    // }

    getCreatedOrPublished(status: string): Observable<any>{
        const query: string = this.helper.buildCreatedVsPublishedQuery( status);
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

    getAllMedias(): Observable<any>{
        const team = this.config.checkApiTeam;
        const query: string = this.helper.buildAllMediaQuery(team);
        const headers = this.config.headers;
        return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
            map(res => (res.data.data.team.medias_count)),
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