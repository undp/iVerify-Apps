import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { InfoLogger } from "../logger/info-logger.service";
import { Stats } from "./models/stats.model";

import { StatsFormatService } from "./stats-format.service";
import { CheckStatsService } from "libs/meedan-check-client/src/lib/check-stats.service";

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
    
    async getTicketsByTags(startDate: Date, endDate: Date, tags: string[]){
        const results = await this.checkStatsClient.getTicketsByTags(tags).toPromise();
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

    async getTicketsByChannel(startDate: Date, endDate: Date){
        return await this.checkStatsClient.getTicketsByChannel(startDate, endDate).toPromise();
    }

    async getTicketsByStatus(startDate: Date, endDate: Date){
        const results = await this.checkStatsClient.getTicketsByStatuses().toPromise();
        return this.formatService.formatTticketsByStatus(startDate, endDate, results);
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

    private async saveOne(stat: Stats){
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