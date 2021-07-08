import { HttpException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Equal, In, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { InfoLogger } from "../logger/info-logger.service";
import { Stats } from "./models/stats.model";
import { DateTime, Interval } from 'luxon';
import { EnumValues } from 'enum-values';

import { StatsFormatService } from "./stats-format.service";
import { CheckStatsService } from "libs/meedan-check-client/src/lib/check-stats.service";
import { StatusesMap } from "libs/meedan-check-client/src/lib/interfaces/statuses-map";
import { CountBy } from "./models/count-by.enum";
import { format } from "date-fns";

@Injectable()
export class StatsService{
    private readonly logger = new Logger('MeedanCheckClient');

    constructor(
        @InjectRepository(Stats)
        private readonly statsRepository: Repository<Stats>,
        private formatService: StatsFormatService,
        private checkStatsClient: CheckStatsService
        ) {
    }

    async processItemStatusChanged(id: string, startDate: Date, endDate: Date){
        const results = await this.checkStatsClient.getTicketLastStatus(id).toPromise();
        const creationDate = DateTime.fromSeconds(+results.project_media.created_at);
        const title = results.project_media.title;
        const node = results.project_media.log.edges.find(node => node.node.event_type === 'update_dynamicannotationfield');
        const status_changes_obj = JSON.parse(node.node.object_changes_json);
        const values = status_changes_obj.value.map(val => JSON.parse(val));
        const resolutionDate =  DateTime.fromSeconds(+node.node.created_at);
        const initialStates = StatusesMap.filter(status => !status.resolution).map(status => status.value);
        const resolutionStatuses = StatusesMap.filter(status => status.resolution).map(status => status.value);
        const defaultStatuses = StatusesMap.filter(status => status.default).map(status => status.value);
        const activeStatuses = StatusesMap.filter(status => !status.default).map(status => status.value);
        if(initialStates.indexOf(values[0]) > -1 && resolutionStatuses.indexOf(values[1]) > -1){
            const resolutionTime = Math.round(Interval.fromDateTimes(creationDate, resolutionDate).length('hours'));
            const stats: Partial<Stats> = this.formatService.formatResolutionTime(startDate, endDate, title, resolutionTime);
            await this.saveOne(stats);
        }
        if(defaultStatuses.indexOf(values[0]) > -1 && activeStatuses.indexOf(values[1]) > -1){
            const responseTime = Math.round(Interval.fromDateTimes(creationDate, resolutionDate).length('hours'));
            const stats: Partial<Stats> = this.formatService.formatResponseTime(startDate, endDate, title, responseTime);
            await this.saveOne(stats);
        }
    }

    async fetchAndStore(startDate: Date, endDate: Date){
        try{
            const ticketsByAgent: Stats[] = await this.getTicketsByAgent(startDate, endDate);
            const ticketsByTag: Stats[] = await this.getTicketsByTags(startDate, endDate);
            const ticketsByStatus: Stats[] = await this.getTicketsByStatus(startDate, endDate);
            const ticketsBySource: Stats[] = await this.getTicketsBySource(startDate, endDate);
            const createdVsPublished: Stats[] = await this.getCreatedVsPublished(startDate, endDate);
            // const ticketsByChannel: Stats[] = await this.getTicketsByChannel(startDate, endDate);
            // const ticketsByType: Stats[] = await this.getTicketsByType(startDate, endDate);
            const stats: Stats[] = [
                ...ticketsByAgent,
                ...ticketsByTag,
                ...ticketsByStatus,
                ...ticketsBySource,
                ...createdVsPublished,
                // ...this.formatService.formatTticketsByChannel(ticketsByChannel),
                // ...this.formatService.formatTticketsByType(ticketsByType),
            ]
            return await this.saveMany(stats);
        }catch(e){
            throw new HttpException(e.message, 500);
        }
    }

    async getTicketsByAgent(startDate: Date, endDate: Date){
        const results = await this.checkStatsClient.getTicketsByAgent(startDate, endDate).toPromise();
        return this.formatService.formatTticketsByAgent(startDate, endDate, results);
    }
    
    async getTicketsByTags(startDate: Date, endDate: Date){
        const results = await this.checkStatsClient.getTicketsByTags().toPromise();
        return this.formatService.formatTticketsByTags(startDate, endDate, results);
    }

    async getTicketsBySource(startDate: Date, endDate: Date){
        const results = await this.checkStatsClient.getTicketsBySource(startDate, endDate).toPromise();
        return this.formatService.formatTticketsBySource(startDate, endDate, results)
    }

    async getCreatedVsPublished(startDate: Date, endDate: Date){
        const results = await this.checkStatsClient.getCreatedVsPublished().toPromise();
        return this.formatService.formatCreatedVsPublished(startDate, endDate, results);
    }

    async getTicketsByStatus(startDate: Date, endDate: Date){
        const results = await this.checkStatsClient.getTicketsByStatuses().toPromise();
        return this.formatService.formatTticketsByStatus(startDate, endDate, results);
    }

    async getTicketsByChannel(startDate: Date, endDate: Date){
        return await this.checkStatsClient.getTicketsByChannel(startDate, endDate).toPromise();
    }

    async getTicketsByType(startDate: Date, endDate: Date){
        return await this.checkStatsClient.getTicketsByType(startDate, endDate).toPromise();
    }


    async saveMany(stats: Stats[]){
        const results: Stats[] = await Promise.all(
            stats.map(stat => this.saveOne(stat))
        );
        return results; 
    }

    private async saveOne(stat: Partial<Stats>){
        const newRecord = await this.statsRepository.create(stat);
        return this.statsRepository.save(newRecord);
    }

    async getByDate(startDate: Date, endDate: Date){
        const formattedStart = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`;
        const formattedEnd = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`;

        const aggregationStats: Stats[] = await this.statsRepository.find({
            where: {
                startDate: MoreThanOrEqual(formattedStart),
                endDate: LessThanOrEqual(formattedEnd),
                countBy: In([
                    CountBy.agentUnstarted.toString(),
                    CountBy.agentProcessing.toString(),
                    CountBy.agentSolved.toString(),
                    CountBy.source.toString()
                ])
            }
        });
        const aggregatedStats = this.aggregate(aggregationStats);

        const searchStart = new Date();
        searchStart.setHours(endDate.getHours() -24);
        const formattedSearchStart = `${searchStart.getFullYear()}-${searchStart.getMonth() + 1}-${searchStart.getDate()}`;


        const latestStats: Stats[] = await this.statsRepository.find({
            where: {
                startDate: MoreThanOrEqual(formattedSearchStart),
                endDate: LessThanOrEqual(formattedEnd),
                countBy: In([
                    CountBy.createdVsPublished.toString(),
                    CountBy.tag.toString(),
                    CountBy.status.toString()
                ])
            }
        }); 


        const latest = this.aggregateByCountBy(latestStats);

        return {
            range: { startDate, endDate },
            results: {...aggregatedStats, ...latest}
        }

    }

    private aggregateByCountBy(stats: Stats[]){
        return stats.reduce((acc, val) => {
            const obj = {category: val.category, count: val.count};
            if(!acc[val.countBy]) acc[val.countBy] = [obj];
            else acc[val.countBy].push(obj)
            return acc;
        }, {});
    }

    private aggregate(stats: Stats[]){

        const aggregateByCountBy = this.aggregateByCountBy(stats);

        return Object.keys(aggregateByCountBy).reduce((acc, val) => {
            acc[val] = this.aggregateByCategory(aggregateByCountBy[val])
            return acc;
        }, {})

    }

    private aggregateByCategory(objArr: {category: string, count: number}[]){
        return objArr.reduce((acc, val) => {
            if(!acc[val.category]) acc[val.category] = val.count;
            else acc[val.category] = acc[val.category] + val.count;
            return acc;
        }, {})
    }
    
}