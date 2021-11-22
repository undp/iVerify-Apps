import { HttpException, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { StatsService } from "./stats.service";

@Injectable()
export class StatsCronService{
    private readonly logger = new Logger('StatsCronService');

    constructor(private statsService: StatsService){}

    @Timeout(10000)
    async handleTimeout(){
        const dbIsEmpty = await this.statsService.dbIsEmpty();
        if(!dbIsEmpty) {
            this.logger.log(`DB is not empty, skipping initial job.`)
            return
        };
        const day = new Date();
        for (let i = 1; i < 20; i++) {
            const previousDay = new Date(day.getTime());
            previousDay.setHours(day.getHours() - 24 * i);
            this.logger.log(`Running initial job for day (UTC) ${previousDay.toUTCString()}`)
            await this.fetchAndStore(previousDay, false);
        }
        return Promise.resolve(true);
        
    }
    
    @Cron(CronExpression.EVERY_DAY_AT_1AM)
    async handleCron(){
        const day = new Date();
        this.logger.log(`Running stats cron job for dat (UTC) ${day.toUTCString()}`)
        return await this.fetchAndStore(day);
    }

    async fetchAndStore(day: Date, allPrevious?: boolean){
        try{            
            await this.statsService.fetchAndStore(day, allPrevious);
            this.logger.log('Sats saved successfully.')
        } catch(e){
            this.logger.error('Stats Cron job error: ', e.message);
            throw new HttpException(e.message, 500); 
        }
    }
}