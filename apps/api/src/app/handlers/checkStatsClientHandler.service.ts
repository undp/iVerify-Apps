/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable, Logger } from '@nestjs/common';

import { CheckStatsService } from '@iverify/meedan-check-client/src/lib/check-stats.service';
import { LocationsService } from '../locations/locations.service';
import {
    CheckApiConfig,
    CheckApiConfigHeaders,
    MeedanCheckClientService,
    ToxicityScores,
} from '@iverify/meedan-check-client/src';
import { from, switchMap } from 'rxjs';
import { isEmpty } from 'radash';
import { toArray } from 'lodash';
/**
 * @description This class is used to be a bridge between the meedan lib and the service.
 *  It dynamically adds the location config to allow the lib to work in a multi-tenancy approach
 */
@Injectable()
export class CheckClientHandlerService {
    private logger = new Logger(CheckClientHandlerService.name);

    constructor(
        private locationsService: LocationsService,
        private checkClient: MeedanCheckClientService,
        private checkStatsClient: CheckStatsService
    ) {}

    private async getConfigByLocation(
        locationId: string
    ): Promise<CheckApiConfig> {
        let { params } = await this.locationsService.findById(locationId);

        if (isEmpty(params)) {
            const error = `Params not found for location ${locationId}`;
            this.logger.error(error);
            throw new Error(error);
        }

        if (!Array.isArray(params)) {
            params = toArray(params);
        }

        const getParam: any = (param) =>
            params.find(({ key }) => key === param);

        // @ts-ignore
        const requestConfigHeaders: CheckApiConfigHeaders = {
            'Content-Type': 'application/json',
            'X-Check-Token': getParam('CHECK_API_TOKEN')?.value ?? '',
            'X-Check-Team': getParam('CHECK_API_TEAM')?.value ?? '',
            'Cache-Control': 'no-cache',
            locationId,
        };

        const requestConfig: CheckApiConfig = {
            headers: requestConfigHeaders,
            checkApiUrl:
                getParam('CHECK_API_URL')?.value ?? process.env.CHECK_API_URL,
            checkApiToken: getParam('CHECK_API_TOKEN')?.value ?? '',
            checkApiTeam: getParam('CHECK_API_TEAM')?.value ?? '',
            checkPublishFolder:
                getParam('CHECK_API_PUBLISHED_FOLDER')?.value ?? '',
            uploadFolderId: getParam('CHECK_FOLDER_ID')?.value ?? '',
            lang: getParam('LANGUAGE')?.value ?? 'es',
            violationTaskId: getParam('VIOLATION_TASK_ID')?.value ?? '',
        };

        this.logger.log(
            `getConfigByLocation ${locationId} ${JSON.stringify(requestConfig)}`
        );
        return requestConfig;
    }

    getTicketLastStatus(locationId: string, id: string) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                this.logger.log(
                    `getTicketLastStatus ${locationId} ${JSON.stringify(
                        requestConfig
                    )}`
                );
                return this.checkStatsClient.getTicketLastStatus(
                    requestConfig,
                    id
                );
            })
        );
    }

    getAllMedias(locationId: string, id: string) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.checkStatsClient.getAllMedias(requestConfig);
            })
        );
    }

    getCreatedOrPublished(locationId: string, status: string) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.checkStatsClient.getCreatedOrPublished(
                    requestConfig,
                    status
                );
            })
        );
    }

    getCreatedVsPublished(locationId: string) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.checkStatsClient.getCreatedVsPublished(
                    requestConfig
                );
            })
        );
    }

    getTicketsByChannel(
        locationId: string,
        startDate: string,
        endDate: string
    ) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.checkStatsClient.getTicketsByChannel(
                    requestConfig,
                    startDate,
                    endDate
                );
            })
        );
    }

    getTicketsByTaskType(locationId: string, taskId: string, value: string) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.checkStatsClient.getTicketsByTaskType(
                    requestConfig,
                    taskId,
                    value
                );
            })
        );
    }

    getTicketsByViolationTypes(locationId: string) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.checkStatsClient.getTicketsByViolationTypes(
                    requestConfig
                );
            })
        );
    }

    getTicketsBySource(locationId: string, startDate: string, endDate: string) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.checkStatsClient.getTicketsBySource(
                    requestConfig,
                    startDate,
                    endDate
                );
            })
        );
    }

    getTicketsByStatuses(locationId: string, statusesMap) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.checkStatsClient.getTicketsByStatuses(
                    requestConfig,
                    statusesMap
                );
            })
        );
    }

    getTicketsByTag(locationId: string, tag) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.checkStatsClient.getTicketsByTag(
                    requestConfig,
                    tag
                );
            })
        );
    }

    getTicketsByTags(locationId: string) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.checkStatsClient.getTicketsByTags(requestConfig);
            })
        );
    }

    getAllProjects(locationId: string, teamSlug: string) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.checkStatsClient.getAllProjects(
                    requestConfig,
                    teamSlug
                );
            })
        );
    }

    getCountByProject(locationId: string, projectId: number) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.checkStatsClient.getCountByProject(
                    requestConfig,
                    projectId
                );
            })
        );
    }

    getTicketsByProjects(locationId: string) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.checkStatsClient.getTicketsByProjects(
                    requestConfig
                );
            })
        );
    }

    getAllAgents(locationId: string, teamSlug: string) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.checkStatsClient.getAllAgents(
                    requestConfig,
                    teamSlug
                );
            })
        );
    }

    getByAgentAndStatus(locationId: string, agentId: number, status: string) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.checkStatsClient.getByAgentAndStatus(
                    requestConfig,
                    agentId,
                    status
                );
            })
        );
    }

    getByAgentAllStatuses(locationId: string, agent: any, statuses: string[]) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.checkStatsClient.getByAgentAllStatuses(
                    requestConfig,
                    agent,
                    statuses
                );
            })
        );
    }

    getTicketsByAgent(locationId: string, statuses: string[]) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.checkStatsClient.getTicketsByAgent(
                    requestConfig,
                    statuses
                );
            })
        );
    }

    createItemFromWp(
        locationId: string,
        url: string,
        content: string,
        wp_key = 'message_from_website'
    ) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.checkClient.createItemFromWp(
                    requestConfig,
                    url,
                    content,
                    wp_key
                );
            })
        );
    }

    createItem(
        locationId: string,
        url: string,
        toxicityScores: ToxicityScores
    ) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.checkClient.createItem(
                    requestConfig,
                    url,
                    toxicityScores
                );
            })
        );
    }

    getReportWithQuery(locationId: string, url: string, query: string) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.checkClient.getReportWithQuery(
                    requestConfig,
                    query
                );
            })
        );
    }

    getMeedanReport(locationId: string, id: string) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.checkClient.getMeedanReport(requestConfig, id);
            })
        );
    }

    getReport(locationId: string, id: string) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.checkClient.getReport(requestConfig, id);
            })
        );
    }
}
