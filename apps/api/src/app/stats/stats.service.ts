import { HttpException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, In, Repository } from "typeorm";
import { Stats } from "./models/stats.model";
import { DateTime, Interval } from 'luxon';

import { StatsFormatService } from "./stats-format.service";
import { CheckStatsService } from "libs/meedan-check-client/src/lib/check-stats.service";
import { StatsResults, CountBy, StatusesMap } from "@iverify/iverify-common";

@Injectable()
export class StatsService{
    private readonly logger = new Logger('MeedanCheckClient');
    allStatuses = StatusesMap.map(status => status.value);


    constructor(
        @InjectRepository(Stats)
        private readonly statsRepository: Repository<Stats>,
        private formatService: StatsFormatService,
        private checkStatsClient: CheckStatsService,
        ) {
    }

    async processItemStatusChanged(id: string, day: string){
        const results = await this.checkStatsClient.getTicketLastStatus(id).toPromise();
        // console.log('results: ', results)
        const creationDate = DateTime.fromSeconds(+results.project_media.created_at);
        const title = results.project_media.title;
        const node = results.project_media.log.edges.find(node => node.node.event_type === 'update_dynamicannotationfield');
        if(!node) return;
        const status_changes_obj = JSON.parse(node.node.object_changes_json);
        // console.log(node.node)
        // console.log(node.node.object_changes_json)
        const values = status_changes_obj.value.map(val => JSON.parse(val));
        const resolutionDate =  DateTime.fromSeconds(+node.node.created_at);
        // console.log('creationDate: ', creationDate)
        // console.log('resolutionDate: ', resolutionDate)
        const initialStates = StatusesMap.filter(status => !status.resolution).map(status => status.value);
        const resolutionStatuses = StatusesMap.filter(status => status.resolution).map(status => status.value);
        const defaultStatuses = StatusesMap.filter(status => status.default).map(status => status.value);
        const activeStatuses = StatusesMap.filter(status => !status.default).map(status => status.value);
        if(initialStates.indexOf(values[0]) > -1 && resolutionStatuses.indexOf(values[1]) > -1){
            const resolutionTime = Math.round(Interval.fromDateTimes(creationDate, resolutionDate).length('hours'));
            const stats: Partial<Stats> = this.formatService.formatResolutionTime(day, title, resolutionTime);
            return await this.saveOne(stats);
        }
        else if(defaultStatuses.indexOf(values[0]) > -1 && activeStatuses.indexOf(values[1]) > -1){
            const responseTime = Math.round(Interval.fromDateTimes(creationDate, resolutionDate).length('hours'));
            // console.log('response time: ', responseTime)
            const stats: Partial<Stats> = this.formatService.formatResponseTime(day, title, responseTime);
            return await this.saveOne(stats);
        }
        else return null;
    }

    async fetchAndStore(day: Date, allPrevius?: boolean){
        try{
            const endDate = this.formatService.formatDate(day);

            const previousDay = new Date(day.getTime());
            previousDay.setHours(day.getHours() - 24);
            
            const previousYear = new Date(day.getTime());
            previousYear.setFullYear(day.getFullYear() -1);

            const startDate = allPrevius ? this.formatService.formatDate(previousYear) : this.formatService.formatDate(previousDay);

            this.logger.log('Fetching tickes by agent..');
            const ticketsByAgent: Stats[] = await this.getTicketsByAgent(endDate);
            this.logger.log('Fetching tickes by tags..');
            const ticketsByTag: Stats[] = await this.getTicketsByTags(endDate);
            this.logger.log('Fetching tickes by status..');
            const ticketsByStatus: Stats[] = await this.getTicketsByStatus(endDate);
            this.logger.log('Fetching tickes by source..');
            const ticketsBySource: Stats[] = await this.getTicketsBySource(startDate, endDate);
            this.logger.log('Fetching tickes by publication..');
            const createdVsPublished: Stats[] = await this.getCreatedVsPublished(endDate);
            this.logger.log('Fetching tickes by violation type..');
            const ticketsByType: Stats[] = await this.getTicketsByViolationType(endDate);
            // const ticketsByChannel: Stats[] = await this.getTicketsByChannel(startDate, endDate);
            const stats: Stats[] = [
                ...ticketsByAgent,
                ...ticketsByTag,
                ...ticketsByStatus,
                ...ticketsBySource,
                ...createdVsPublished,
                ...ticketsByType
                // ...this.formatService.formatTticketsByChannel(ticketsByChannel),
                // ...this.formatService.formatTticketsByType(ticketsByType),
            ]
            this.logger.log('Saving to DB...');
            return await this.saveMany(stats);
        }catch(e){
            throw new HttpException(e.message, 500);
        }
    }

    async getTicketsByAgent(endDate: string){
        const results = await this.checkStatsClient.getTicketsByAgent(this.allStatuses).toPromise();
        return this.formatService.formatTticketsByAgent(endDate, results);
    }
    
    async getTicketsByTags(endDate: string){
        const results = await this.checkStatsClient.getTicketsByTags().toPromise();
        return this.formatService.formatTticketsByTags(endDate, results);
    }

    async getTicketsBySource(startDate: string, endDate: string){
        const results = await this.checkStatsClient.getTicketsBySource(startDate, endDate).toPromise();
        return this.formatService.formatTticketsBySource(endDate, results)
    }

    async getCreatedVsPublished(endDate: string){
        const results = await this.checkStatsClient.getCreatedVsPublished().toPromise();
        return this.formatService.formatCreatedVsPublished(endDate, results);
    }

    async getTicketsByStatus(endDate: string){
        const results = await this.checkStatsClient.getTicketsByStatuses(StatusesMap).toPromise();
        return this.formatService.formatTticketsByStatus(endDate, results);
    }

    async getTicketsByViolationType(endDate: string){         
        const results = await this.checkStatsClient.getTicketsByViolationTypes().toPromise();
        return this.formatService.formatTticketsByViolation(endDate, results);
    }

    // async getTicketsByChannel(startDate: string, endDate: string){
    //     return await this.checkStatsClient.getTicketsByChannel(startDate, endDate).toPromise();
    // }



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

    async getByDate(startDate: Date, endDate: Date): Promise<StatsResults>{
        const start = new Date(startDate.getTime());
        start.setHours(startDate.getHours() -24);

        const end = new Date(endDate.getTime());
        end.setHours(endDate.getHours() +24);

        const formattedStart = this.formatService.formatDate(start);
        const formattedEnd = this.formatService.formatDate(end);

        const aggregationStats: Stats[] = await this.statsRepository.find({
            where: {
                day: Between(formattedStart, formattedEnd),
                countBy: In([
                    CountBy.source.toString(),
                    // CountBy.type.toString()
                ])
            }
        });
        const aggregatedStats = this.aggregate(aggregationStats);

        const searchStart = new Date(end.getTime());
        searchStart.setHours(endDate.getHours() -24);
        const formattedSearchStart = this.formatService.formatDate(searchStart);

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
                    CountBy.resolutionVelocity.toString()
                ])
            }
        }); 

        const latest = this.aggregateByCountBy(latestStats);
        Object.keys(latest).forEach(key => {
            if(key !== CountBy.responseVelocity && key !== CountBy.resolutionVelocity){
                latest[key] = this.aggregateByDate(latest[key])
            }
        })


        return {
            range: { startDate: formattedStart, endDate: formattedEnd },
            results: {...aggregatedStats, ...latest} 
        }

    }

    async dbIsEmpty(){
        const count = await this.statsRepository.count({});
        return count === 0;
    }

    async truncateTable(){
        const count = await this.statsRepository.count({});
        return count === 0;
    }

    private aggregateByDate(stats: Stats[]){
        return stats.reduce((acc, val) => {
            const obj: Partial<Stats> = {category: val.category, count: val.count};
            if(!acc[val.day]) acc[val.day] = [obj];
            else acc[val.day].push(obj)
            return acc;
        }, {});
    }

    private aggregateByCountBy(stats: Stats[]){
        return stats.reduce((acc, val) => {
            const obj = {category: val.category, count: val.count, day: val.day};
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