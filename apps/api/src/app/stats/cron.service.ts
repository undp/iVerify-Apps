import { HttpException, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { StatsService } from "./stats.service";

@Injectable()
export class StatsCronService{
    private readonly logger = new Logger('StatsCronService');

    constructor(private statsService: StatsService){}

    @Timeout(5000)
    async handleTimeout(){
        const endDate = new Date();
        const startDate = new Date();
        startDate.setHours(new Date().getHours() -48);
        this.logger.log(`Running initial job with startDate ${startDate} and endDate ${endDate}`)
        return await this.fetchAndStore(startDate, endDate);
    }
    
    @Cron(CronExpression.EVERY_HOUR)
    async handleCron(){
        const endDate = new Date().toISOString();
        const startDate = new Date();
        startDate.setHours(new Date().getHours() -24);
        this.logger.log(`Running cron job with startDate ${startDate} and endDate ${endDate}`)
        return await this.fetchAndStore(startDate, endDate);
    }

    async fetchAndStore(startDate, endDate){
        try{            
            await this.statsService.fetchAndStore(startDate, endDate);
            this.logger.log('Sats saved successfully.')
        } catch(e){
            this.logger.error('Stats Cron job error: ', e.message);
            throw new HttpException(e.message, 500);
        }
    }
}