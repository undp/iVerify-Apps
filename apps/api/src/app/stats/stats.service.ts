import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { Stats } from './models/stats.model';
import { DateTime, Interval } from 'luxon';

import { StatsFormatService } from './stats-format.service';
import { CheckStatsService } from '@iverify/meedan-check-client/src/lib/check-stats.service';
import { Article, StatusesMap } from '@iverify/iverify-common';
import { MeedanCheckClientService } from '@iverify/meedan-check-client';
import { CountBy } from '@iverify/common';
import { lastValueFrom } from 'rxjs';

import * as pMap from 'p-map';
import { LocationsService } from '../locations/locations.service';
import { CheckClientHandlerService } from '../handlers/checkStatsClientHandler.service';

@Injectable()
export class StatsService {
    private readonly logger = new Logger(StatsService.name);

    allStatuses = StatusesMap.map((status) => status.value);
    resolutionStatuses = StatusesMap.filter((status) => status.resolution).map(
        (status) => status.value
    );

    constructor(
        @InjectRepository(Stats)
        private readonly statsRepository: Repository<Stats>,
        private formatService: StatsFormatService,
        private checkStatsClient: CheckClientHandlerService,
        // private checkClient: MeedanCheckClientService,
        private locationsService: LocationsService
    ) {}

    async processItemStatusChanged(
        locationId: string,
        id: string,
        day: string
    ) {
        this.logger.log(`[${id}] Getting velocities`);
        const velocities = await this.processVelocities(locationId, id, day);
        this.logger.log(`[${id}] Getting report`);
        const meedanItem: any = await lastValueFrom(
            this.checkStatsClient.getReport(locationId, id)
        );
        const status = meedanItem.status;
        this.logger.log(`[${id}] status `, status);
        const verification = await this.processVerification(
            locationId,
            id,
            status,
            day
        );

        this.logger.log(
            `[${id}] process status result veloficite ${JSON.stringify(
                velocities
            )} verification ${JSON.stringify(verification)}`
        );
        return { velocities, verification };
    }

    async processVerification(
        locationId: string,
        id: string,
        status: string,
        day: string
    ) {
        this.logger.log(
            `[${id}] Processing verification for status ${status} and day ${day}`
        );

        if (this.resolutionStatuses.indexOf(status) === -1) {
            this.logger.log(
                `[${id}] Status ${status} is outside the reselutionStatuses map`
            );
            return;
        }

        const statusObj = StatusesMap.find((s) => s['value'] === status);
        const statusLabel = statusObj ? statusObj['label'] : '';

        const query = {
            countBy: CountBy.verifiedByDay,
            category: statusLabel,
            day,
            locationId,
        };

        this.logger.log(
            `[${id}] Search stats with query `,
            JSON.stringify(query)
        );

        const stat: Stats = await this.statsRepository.findOne({
            where: query,
        });

        this.logger.log(`[${id}] Found record: ${stat}`);
        if (stat) stat.count++;
        const statToSave = stat
            ? stat
            : {
                  day,
                  countBy: CountBy.verifiedByDay,
                  category: statusLabel,
                  count: 1,
                  locationId,
              };
        this.logger.log(`[${id}] Saving stat: ${JSON.stringify(statToSave)}`);
        return await this.statsRepository.save(statToSave);
    }

    async addToxicityStats(
        locationId: string,
        toxicCount: number,
        day: string
    ) {
        this.logger.log(
            `Processing toxicity count ${toxicCount} and day ${day}`
        );
        const category = 'toxic';
        const stat: Stats = await this.statsRepository.findOne({
            where: {
                countBy: CountBy.toxicity,
                category,
                day,
                locationId,
            },
        });
        this.logger.log(`Found record: ${stat}`);
        if (stat) stat.count += toxicCount;
        const statToSave = stat
            ? stat
            : {
                  day,
                  countBy: CountBy.toxicity,
                  category,
                  count: toxicCount,
                  locationId,
              };
        this.logger.log(`Saving stat: ${JSON.stringify(statToSave)}`);
        return await this.statsRepository.save(statToSave);
    }

    async addToxicPublishedStats(
        locationId: string,
        article: Article
    ): Promise<Stats> {
        const day: string = this.formatService.formatDate(
            new Date(article.creationDate)
        );
        this.logger.log(
            `Processing toxic published article ${JSON.stringify(
                article
            )} and day ${day}`
        );
        const category: string = article.toxicFlag
            ? 'publishedToxic'
            : 'publishedNonToxic';

        const stat: Stats = await this.statsRepository.findOne({
            where: {
                countBy: CountBy.toxicity,
                category,
                day,
                locationId,
            },
        });

        this.logger.log(`Found record: ${stat}`);

        if (stat) {
            stat.count++;
        }

        const statToSave = stat
            ? stat
            : { day, countBy: CountBy.toxicity, category, count: 1 };
        this.logger.log(`Saving stat: ${JSON.stringify(statToSave)}`);
        return await this.statsRepository.save(statToSave);
    }

    async processVelocities(locationId: string, id: string, day: string) {
        this.logger.log(`[${id}] Getting last status`);
        const results: any = await lastValueFrom(
            this.checkStatsClient.getTicketLastStatus(locationId, id)
        );

        this.logger.verbose(
            `[${id}] last status result ${JSON.stringify(results)}`
        );

        const creationDate = DateTime.fromSeconds(
            +results.project_media.created_at
        );
        this.logger.verbose(`[${id}] creationDate ${creationDate}`);

        const title = results.project_media.title;
        this.logger.verbose(`[${id}] title ${title}`);

        const node = results.project_media.log.edges.find(
            (node) => node.node.event_type === 'update_dynamicannotationfield'
        );

        this.logger.verbose(`[${id}] node filtered ${JSON.stringify(node)}`);

        if (!node) {
            this.logger.log(
                `[${id}] node event type is out of the scope of the velocites verification`
            );
            return;
        }

        const status_changes_obj = JSON.parse(node.node.object_changes_json);

        this.logger.verbose(
            `[${id}] status changes obj ${JSON.stringify(status_changes_obj)}`
        );

        const values = status_changes_obj.value.map((val) => JSON.parse(val));

        const resolutionDate = DateTime.fromSeconds(+node.node.created_at);
        const initialStates = StatusesMap.filter(
            (status) => !status.resolution
        ).map((status) => status.value);
        const resolutionStatuses = StatusesMap.filter(
            (status) => status.resolution
        ).map((status) => status.value);
        const defaultStatuses = StatusesMap.filter(
            (status) => status.default
        ).map((status) => status.value);
        const activeStatuses = StatusesMap.filter(
            (status) => !status.default
        ).map((status) => status.value);

        this.logger.verbose(`[${id}] 
                resolution date ${resolutionDate}
                initial states ${JSON.stringify(initialStates)}
                resolution statuses ${JSON.stringify(resolutionStatuses)}
                default statuses ${JSON.stringify(defaultStatuses)}
                active statuses ${JSON.stringify(activeStatuses)}`);

        if (
            initialStates.indexOf(values[0]) > -1 &&
            resolutionStatuses.indexOf(values[1]) > -1
        ) {
            const resolutionTime = Math.round(
                Interval.fromDateTimes(creationDate, resolutionDate).length(
                    'hours'
                )
            );
            const stats: Partial<Stats> =
                this.formatService.formatResolutionTime(
                    day,
                    title,
                    resolutionTime
                );
            return await this.saveOne(stats);
        } else if (
            defaultStatuses.indexOf(values[0]) > -1 &&
            activeStatuses.indexOf(values[1]) > -1
        ) {
            const responseTime = Math.round(
                Interval.fromDateTimes(creationDate, resolutionDate).length(
                    'hours'
                )
            );
            // console.log('response time: ', responseTime)
            const stats: Partial<Stats> = this.formatService.formatResponseTime(
                day,
                title,
                responseTime
            );
            return await this.saveOne(stats);
        } else {
            this.logger.log(
                `[${id}] statuses changes do not match any mapped status`
            );
            return null;
        }
    }

    private async processFetchAndStore(
        locationId: string,
        day: Date,
        allPrevius?: boolean
    ): Promise<any> {
        try {
            const endDate = this.formatService.formatDate(day);

            const previousDay = new Date(day.getTime());
            previousDay.setHours(day.getHours() - 24);

            const previousYear = new Date(day.getTime());
            previousYear.setFullYear(day.getFullYear() - 1);

            const startDate = allPrevius
                ? this.formatService.formatDate(previousYear)
                : this.formatService.formatDate(previousDay);

            this.logger.log('Fetching tickes by agent..');
            const ticketsByAgent: Stats[] = await this.getTicketsByAgent(
                locationId,
                endDate
            );
            this.logger.log('Fetching tickes by tags..');
            const ticketsByTag: Stats[] = await this.getTicketsByTags(
                locationId,
                endDate
            );
            this.logger.log('Fetching tickes by status..');
            const ticketsByStatus: Stats[] = await this.getTicketsByStatus(
                locationId,
                endDate
            );
            this.logger.log('Fetching tickes by source..');
            const ticketsBySource: Stats[] = await this.getTicketsBySource(
                locationId,
                startDate,
                endDate
            );
            this.logger.log('Fetching tickes by publication..');
            const createdVsPublished: Stats[] =
                await this.getCreatedVsPublished(locationId, endDate);
            this.logger.log('Fetching tickes by violation type..');
            const ticketsByType: Stats[] = await this.getTicketsByViolationType(
                locationId,
                endDate
            );
            this.logger.log('Fetching tickes by folder..');
            const ticketsByFolder: Stats[] = await this.getTicketsByFolder(
                locationId,
                endDate
            );
            // const ticketsByChannel: Stats[] = await this.getTicketsByChannel(startDate, endDate);
            const stats: Stats[] = [
                ...ticketsByAgent,
                ...ticketsByTag,
                ...ticketsByStatus,
                ...ticketsBySource,
                ...createdVsPublished,
                ...ticketsByType,
                ...ticketsByFolder,
                // ...this.formatService.formatTticketsByChannel(ticketsByChannel),
                // ...this.formatService.formatTticketsByType(ticketsByType),
            ].map((stat) => {
                return new Stats({ ...stat, locationId });
            });

            this.logger.log('Saving to DB...');
            return await this.saveMany(stats);
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }

    async fetchAndStore(day: Date, allPrevius?: boolean) {
        try {
            const locations = await this.locationsService.findAll({
                limit: 10,
                offset: 0,
            });

            const result = await pMap(
                locations,
                async (location) => {
                    return this.processFetchAndStore(
                        location.id,
                        day,
                        allPrevius
                    );
                },
                {
                    concurrency: 2,
                    stopOnError: false,
                }
            );

            return result;
        } catch (e) {
            throw new HttpException(e.message, 500);
        }
    }

    async getTicketsByAgent(locationId: string, endDate: string) {
        const results = await lastValueFrom(
            this.checkStatsClient.getTicketsByAgent(
                locationId,
                this.allStatuses
            )
        );

        return this.formatService.formatTticketsByAgent(endDate, results);
    }

    async getTicketsByFolder(locationId: string, endDate: string) {
        const results = await lastValueFrom(
            this.checkStatsClient.getTicketsByProjects(locationId)
        );

        return this.formatService.formatTticketsByProjects(endDate, results);
    }

    async getTicketsByTags(locationId: string, endDate: string) {
        const results = await lastValueFrom(
            this.checkStatsClient.getTicketsByTags(locationId)
        );

        return this.formatService.formatTticketsByTags(endDate, results);
    }

    async getTicketsBySource(
        locationId: string,
        startDate: string,
        endDate: string
    ) {
        const results = await lastValueFrom(
            this.checkStatsClient.getTicketsBySource(
                locationId,
                startDate,
                endDate
            )
        );

        return this.formatService.formatTticketsBySource(endDate, results);
    }

    async getCreatedVsPublished(locationId: string, endDate: string) {
        const results = await lastValueFrom(
            this.checkStatsClient.getCreatedVsPublished(locationId)
        );

        return this.formatService.formatCreatedVsPublished(endDate, results);
    }

    async getTicketsByStatus(locationId: string, endDate: string) {
        const results = await lastValueFrom(
            this.checkStatsClient.getTicketsByStatuses(locationId, StatusesMap)
        );

        return this.formatService.formatTticketsByStatus(endDate, results);
    }

    async getTicketsByViolationType(locationId: string, endDate: string) {
        const results = await lastValueFrom(
            this.checkStatsClient.getTicketsByViolationTypes(locationId)
        );

        this.logger.log(`Got tickets by type: ${JSON.stringify(results)}`);
        const formatted = this.formatService.formatTticketsByViolation(
            endDate,
            results
        );
        this.logger.log(
            `Formatted tickets by type: ${JSON.stringify(formatted)}`
        );
        return formatted;
    }

    // async getTicketsByChannel(startDate: string, endDate: string){
    //     return await this.checkStatsClient.getTicketsByChannel(startDate, endDate).toPromise();
    // }

    async saveMany(stats: Stats[]) {
        const results = await pMap(stats, async (stat) => this.saveOne(stat), {
            concurrency: 2,
        });

        return results;
    }

    private async saveOne(stat: Partial<Stats>) {
        const newRecord = await this.statsRepository.create(stat);
        return this.statsRepository.save(newRecord);
    }

    async getByDate(
        locationId: string,
        startDate: Date,
        endDate: Date
    ): Promise<any> {
        const start = new Date(startDate.getTime());
        start.setHours(startDate.getHours() - 24);

        const end = new Date(endDate.getTime());
        end.setHours(endDate.getHours() + 24);

        const formattedStart = this.formatService.formatDate(start);
        const formattedEnd = this.formatService.formatDate(end);

        const aggregationStats: Stats[] = await this.statsRepository.find({
            where: {
                day: Between(formattedStart, formattedEnd),
                countBy: In([
                    CountBy.source.toString(),
                    // CountBy.type.toString()
                ]),
                locationId,
            },
        });
        const aggregatedStats = this.aggregate(aggregationStats);

        const searchStart = new Date(end.getTime());
        searchStart.setHours(endDate.getHours() - 24);

        const latestStats: Stats[] = await this.statsRepository.find({
            where: {
                day: Between(formattedStart, formattedEnd),
                countBy: In([
                    CountBy.agentUnstarted.toString(),
                    CountBy.agentProcessing.toString(),
                    CountBy.agentSolved.toString(),
                    CountBy.createdVsPublished.toString(),
                    CountBy.tag.toString(),
                    CountBy.violationType.toString(),
                    CountBy.status.toString(),
                    CountBy.responseVelocity.toString(),
                    CountBy.resolutionVelocity.toString(),
                    CountBy.verifiedByDay.toString(),
                    CountBy.folder.toString(),
                    CountBy.toxicity.toString(),
                ]),
            },
        });

        const latest = this.aggregateByCountBy(latestStats);
        //group by date:
        Object.keys(latest).forEach((key) => {
            if (
                key !== CountBy.responseVelocity &&
                key !== CountBy.resolutionVelocity
            ) {
                latest[key] = this.aggregateByDate(latest[key]);
            }
        });

        return {
            // range: { startDate: formattedStart, endDate: formattedEnd },
            results: { ...aggregatedStats, ...latest },
        };
    }

    async dbIsEmpty() {
        const count = await this.statsRepository.count({});
        return count === 0;
    }

    async truncateTable() {
        const count = await this.statsRepository.count({});
        return count === 0;
    }

    private aggregateByDate(stats: Stats[]) {
        return stats.reduce((acc, val) => {
            const obj: Partial<Stats> = {
                category: val.category,
                count: val.count,
            };
            if (!acc[val.day]) acc[val.day] = [obj];
            else acc[val.day].push(obj);
            return acc;
        }, {});
    }

    private aggregateByCountBy(stats: Stats[]) {
        return stats.reduce((acc, val) => {
            const obj = {
                category: val.category,
                count: val.count,
                day: val.day,
                locationId: val.locationId,
            };

            if (!acc[val.countBy]) acc[val.countBy] = [obj];
            else acc[val.countBy].push(obj);
            return acc;
        }, {});
    }

    private aggregate(stats: Stats[]) {
        const aggregateByCountBy = this.aggregateByCountBy(stats);

        return Object.keys(aggregateByCountBy).reduce((acc, val) => {
            acc[val] = this.aggregateByCategory(aggregateByCountBy[val]);
            return acc;
        }, {});
    }

    private aggregateByCategory(objArr: { category: string; count: number }[]) {
        return objArr.reduce((acc, val) => {
            if (!acc[val.category]) acc[val.category] = val.count;
            else acc[val.category] = acc[val.category] + val.count;
            return acc;
        }, {});
    }
}
