import { TasksLabels } from '@iverify/common/src';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import {
    catchError,
    concatMap,
    filter,
    map,
    reduce,
    retry,
} from 'rxjs/operators';

import { CheckClientHelperService } from './helper.service';
import { HttpService } from '@nestjs/axios';
import { CheckApiConfig } from './interfaces/check-api.config';
import { MeedanCheckClientService } from './meedan-check-client.service';
// import { StatusesMap, TasksLabels } from "@iverify/iverify-common";

@Injectable()
export class CheckStatsService {
    private readonly logger = new Logger(CheckStatsService.name);
    // lang = process.env.language;

    constructor(
        private http: HttpService,
        private helper: CheckClientHelperService,
        private checkClient: MeedanCheckClientService
    ) {}

    getTicketsByAgent(
        config: CheckApiConfig,
        statuses: string[]
    ): Observable<any> {
        const teamSlug = config.checkApiTeam;
        return this.getAllAgents(config, teamSlug).pipe(
            concatMap((agents) => from(agents)),
            concatMap((agent) =>
                this.getByAgentAllStatuses(config, agent, statuses)
            ),
            reduce((acc, val) => [...acc, ...val], []),
            catchError((err) => {
                this.logger.error(`Error getting tickets by agents: `, err);
                throw err;
            })
        );
    }

    getByAgentAllStatuses(
        config: CheckApiConfig,
        agent: any,
        statuses: string[]
    ) {
        return from(statuses).pipe(
            concatMap((status) =>
                this.getByAgentAndStatus(config, agent.id, status).pipe(
                    map((count) => ({ agent: agent.name, status, count }))
                )
            ),
            reduce((acc, val) => [...acc, val], []),
            catchError((err) => {
                this.logger.error(
                    `Error getting tickets by status for agent ${agent.name}: `,
                    err.message
                );
                throw err;
            })
        );
    }

    getByAgentAndStatus(
        config: CheckApiConfig,
        agentId: number,
        status: string
    ) {
        const query: string = this.helper.buildGetByAgentAndStatus(
            agentId,
            status
        );
        const headers = config.headers;

        return this.http.post(config.checkApiUrl, { query }, { headers }).pipe(
            map((res) => res.data.data.search.number_of_results),
            retry(3),
            catchError((err) => {
                this.logger.error(
                    `Error getting tickets for agentId ${agentId} and status ${status}: `,
                    err.message
                );
                throw err;
            })
        );
    }

    getAllAgents(config: CheckApiConfig, teamSlug: string) {
        const query: string = this.helper.buildAllAgentsQuery(teamSlug);
        const headers = config.headers;
        return this.http.post(config.checkApiUrl, { query }, { headers }).pipe(
            map((res) => res.data.data),
            map((res) => this.helper.formatAllAgentsResponse(res)),
            retry(3),
            catchError((err) => {
                this.logger.error('Error getting all agents: ', err.message);
                throw err;
            })
        );
    }

    getTicketsByInputProjects(config: CheckApiConfig) {
        const team = config.checkApiTeam;
        return this.getAllProjects(config, team).pipe(
            concatMap((projects) => from(projects)),
            filter((project) => project['title'].startsWith('1 ')),
            concatMap((project) =>
                this.getCountByProject(config, project['id']).pipe(
                    map((count) => ({ project: project['title'], count }))
                )
            ),
            reduce((acc, val) => [...acc, val], []),
            catchError((err) => {
                this.logger.error(
                    `Error getting tickets by input projects: `,
                    err.message
                );
                throw err;
            })
        );
    }

    getTicketsByProjects(config: CheckApiConfig) {
        const team = config.checkApiTeam;
        return this.getAllProjects(config, team).pipe(
            concatMap((projects) => from(projects)),
            concatMap((project) =>
                this.getCountByProject(config, project['id']).pipe(
                    map((count) => ({ project: project['title'], count }))
                )
            ),
            reduce((acc, val) => [...acc, val], []),
            catchError((err) => {
                this.logger.error(
                    `Error getting tickets by input projects: `,
                    err.message
                );
                throw err;
            })
        );
    }

    getCountByProject(config: CheckApiConfig, projectId: number) {
        const query: string = this.helper.buildCountByProjectQuery(projectId);
        const headers = config.headers;

        return this.http.post(config.checkApiUrl, { query }, { headers }).pipe(
            map((res) => res.data.data.search.number_of_results),
            retry(3),
            catchError((err) => {
                this.logger.error(
                    `Error getting tickets for projectId ${projectId}: `,
                    err.message
                );
                throw err;
            })
        );
    }

    getAllProjects(config: CheckApiConfig, teamSlug: string) {
        const query: string = this.helper.buildAllProjectsQuery(teamSlug);
        const headers = config.headers;
        return this.http.post(config.checkApiUrl, { query }, { headers }).pipe(
            map((res) => res.data.data),
            map((res) => this.helper.formatAllProjectsResponse(res)),
            retry(3),
            catchError((err) => {
                this.logger.error('Error getting all agents: ', err.message);
                throw err;
            })
        );
    }

    getTicketsByTags(config: CheckApiConfig): Observable<any> {
        const team = config.checkApiTeam;
        const headers = config.headers;
        const query = this.helper.buildTeamTagsQuery(team);
        return this.http.post(config.checkApiUrl, { query }, { headers }).pipe(
            map((res) =>
                res.data.data.team.tag_texts.edges.map((node) => node.node.text)
            ),
            retry(3),
            concatMap((tags) => from(tags)),
            concatMap((tag) => this.getTicketsByTag(config, tag)),
            reduce((acc, val) => [...acc, val], []),
            catchError((err) => {
                this.logger.error(
                    'Error getting tickets by agent: ',
                    err.message
                );
                throw err;
            })
        );
    }

    getTicketsByTag(config: CheckApiConfig, tag): Observable<any> {
        const query: string = this.helper.buildTicketsByTagQuery(tag);
        const headers = config.headers;
        return this.http.post(config.checkApiUrl, { query }, { headers }).pipe(
            map((res) => ({ ...res.data.data, tag })),
            retry(3),
            catchError((err) => {
                this.logger.error(
                    'Error getting tickets by tag: ',
                    err.message
                );
                throw err;
            })
        );
    }

    getTicketsByStatuses(config: CheckApiConfig, statusesMap): Observable<any> {
        const statuses = statusesMap.map((i) => i.value);
        return from(statuses).pipe(
            concatMap((status: string) =>
                this.getTicketsByStatus(config, status)
            ),
            reduce((acc, val) => [...acc, val], [])
        );
    }

    getTicketsByStatus(
        config: CheckApiConfig,
        status: string
    ): Observable<any> {
        const query: string = this.helper.buildTicketsByStatusQuery(status);
        const headers = config.headers;
        return this.http.post(config.checkApiUrl, { query }, { headers }).pipe(
            map((res) => ({ ...res.data.data, status })),
            retry(3),
            catchError((err) => {
                this.logger.error(
                    'Error getting tickets by status: ',
                    err.message
                );
                throw err;
            })
        );
    }

    getTicketsBySource(
        config: CheckApiConfig,
        startDate: string,
        endDate: string
    ): Observable<any> {
        const query: string = this.helper.buildTicketsBySourceQuery(
            startDate,
            endDate
        );
        const headers = config.headers;
        return this.http.post(config.checkApiUrl, { query }, { headers }).pipe(
            map((res) => res.data.data),
            retry(3),
            catchError((err) => {
                this.logger.error(
                    'Error getting tickets by source: ',
                    err.message
                );
                throw err;
            })
        );
    }

    getTicketsByViolationTypes(config: CheckApiConfig) {
        // const violationTaskId = '7766';
        const violationTaskId = process.env.VIOLATION_TASK_ID;
        const taskResponses = [
            TasksLabels[config.lang].violation_disinfo,
            TasksLabels[config.lang].violation_misinfo,
            TasksLabels[config.lang].violation_hate_speech,
            TasksLabels[config.lang].violation_threat,
            TasksLabels[config.lang].violation_violence,
            TasksLabels[config.lang].violation_disinfo,
            TasksLabels[config.lang].violation_no_threat,
        ];

        return from(taskResponses).pipe(
            concatMap((violation) =>
                this.getTicketsByTaskType(
                    config,
                    violationTaskId,
                    violation
                ).pipe(
                    map((result) => {
                        console.log(
                            'Tickets by type results: ',
                            JSON.stringify(result)
                        );
                        const count =
                            result &&
                            result.search &&
                            result.search.number_of_results
                                ? result.search.number_of_results
                                : 0;
                        return { violation, count };
                    })
                )
            ),
            reduce((acc, val) => [...acc, val], []),
            catchError((err) => {
                this.logger.error(
                    'Error getting tickets by type: ',
                    err.message
                );
                throw err;
            })
        );
    }

    getTicketsByTaskType(
        config: CheckApiConfig,
        taskId: string,
        value: string
    ): Observable<any> {
        const query: string = this.helper.buildTicketsByTaskTypeQuery(
            taskId,
            value
        );
        console.log('Tickets by type query: ', query);
        const headers = config.headers;
        return this.http.post(config.checkApiUrl, { query }, { headers }).pipe(
            map((res) => res.data.data),
            retry(3),
            catchError((err) => {
                this.logger.error(
                    'Error getting tickets by type: ',
                    err.message
                );
                throw err;
            })
        );
    }

    getTicketsByChannel(
        config: CheckApiConfig,
        startDate: string,
        endDate: string
    ): Observable<any> {
        const query: string = this.helper.buildTicketsByChannelQuery(
            startDate,
            endDate
        );
        const headers = config.headers;
        return this.http.post(config.checkApiUrl, { query }, { headers }).pipe(
            map((res) => res.data.data),
            retry(3),
            catchError((err) => {
                this.logger.error(
                    'Error getting tickets by channel: ',
                    err.message
                );
                throw err;
            })
        );
    }

    getCreatedVsPublished(config: CheckApiConfig): Observable<any> {
        return from(['published', 'unpublished']).pipe(
            concatMap((status) => this.getCreatedOrPublished(config, status)),
            reduce((acc, val) => [...acc, val], [])
        );
    }

    // getCreatedVsPublished(): Observable<any>{
    //     const publishedFolderId = +this.config.checkPublishFolder;
    //     return combineLatest([this.getAllMedias(), this.getCountByProject(publishedFolderId)]).pipe(
    //         map(([created, published]) => ({created, published}))
    //     )
    // }

    getCreatedOrPublished(
        config: CheckApiConfig,
        status: string
    ): Observable<any> {
        const query: string = this.helper.buildCreatedVsPublishedQuery(status);
        const headers = config.headers;
        return this.http.post(config.checkApiUrl, { query }, { headers }).pipe(
            map((res) => ({ ...res.data.data, status })),
            retry(3),
            catchError((err) => {
                this.logger.error(
                    'Error getting tickets created vs published: ',
                    err.message
                );
                throw err;
            })
        );
    }

    getAllMedias(config: CheckApiConfig): Observable<any> {
        const team = config.checkApiTeam;
        const query: string = this.helper.buildAllMediaQuery(team);
        const headers = config.headers;
        return this.http.post(config.checkApiUrl, { query }, { headers }).pipe(
            map((res) => res.data.data.team.medias_count),
            retry(3),
            catchError((err) => {
                this.logger.error(
                    'Error getting tickets created vs published: ',
                    err.message
                );
                throw err;
            })
        );
    }

    getTicketLastStatus(config: CheckApiConfig, id: string) {
        const query: string = this.helper.buildTicketLastStatusQuery(id);

        const headers = config.headers;

        this.logger.log(
            ` Requesting ticket last status: ${id} ${JSON.stringify(config)}`
        );

        this.logger.log(
            ` Requesting ticket last status query: ${id} ${JSON.stringify(
                query
            )}`
        );

        return this.http.post(config.checkApiUrl, { query }, { headers }).pipe(
            map((res) => res.data.data),
            retry(3),
            catchError((err) => {
                this.logger.error(
                    ` Error getting ticket last status: ${JSON.stringify(err)}`
                );
                throw err;
            })
        );
    }
}
