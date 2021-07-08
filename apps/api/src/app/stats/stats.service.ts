import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { InfoLogger } from "../logger/info-logger.service";
import { Stats } from "./models/stats.model";
import { DateTime, Interval } from 'luxon';

import { StatsFormatService } from "./stats-format.service";
import { CheckStatsService } from "libs/meedan-check-client/src/lib/check-stats.service";
import { StatusesMap } from "libs/meedan-check-client/src/lib/interfaces/statuses-map";

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

    private async fetchAndStore(startDate: Date, endDate: Date){
        const tags = ['Covid-19', 'Veoter registration']
        const ticketsByAgent: Stats[] = await this.getTicketsByAgent(startDate, endDate);
        const ticketsByChannel: Stats[] = await this.getTicketsByChannel(startDate, endDate);
        const ticketsByTag: Stats[] = await this.getTicketsByTags(startDate, endDate, tags);
        const ticketsByStatus: Stats[] = await this.getTicketsByStatus(startDate, endDate);
        const ticketsBySource: Stats[] = await this.getTicketsBySource(startDate, endDate);
        const ticketsByType: Stats[] = await this.getTicketsByType(startDate, endDate);
        const createdVsPublished: Stats[] = await this.getCreatedVsPublished(startDate, endDate);
        const stats: Stats[] = [
            ...this.formatService.formatTticketsByAgent(startDate, endDate, ticketsByAgent),
            ...this.formatService.formatTticketsByChannel(ticketsByChannel),
            ...this.formatService.formatTticketsByTags(startDate, endDate, ticketsByTag),
            ...this.formatService.formatTticketsByStatus(startDate, endDate, ticketsByStatus),
            ...this.formatService.formatTticketsBySource(startDate, endDate, ticketsBySource),
            ...this.formatService.formatTticketsByType(ticketsByType),
            ...this.formatService.formatCreatedVsPublished(startDate, endDate, createdVsPublished)
        ]
        return await this.saveMany(stats);
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
        const stats: Stats[] = await this.statsRepository.find({
            where: {
                startDate: MoreThanOrEqual(startDate),
                endDate: LessThanOrEqual(endDate)
            }
        });

        return this.aggregate(stats);
    }

    private aggregate(stats: Stats[]){
        const aggregateByCountBy = stats.reduce((acc, val) => {
            const obj = {category: val.category, count: val.count};
            if(!acc[val.countBy]) acc[val.countBy] = [obj];
            else acc[val.countBy].push(obj)
            return acc;
        }, {});

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