import { HttpException, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { AppService } from "./app.service";

@Injectable()
export class CronService{
    private readonly logger = new Logger('CronService');

    constructor(private appService: AppService){}

    @Timeout(5000)
    async handleTimeout(){
        const endDate = new Date().toISOString();
        const start = new Date();
        start.setHours(new Date().getHours() -1);
        const startDate = start.toISOString();
        this.logger.log(`Running initial job with startDate ${startDate} and endDate ${endDate}`)
        return await this.analyze(startDate, endDate);
    }
    
    @Cron(CronExpression.EVERY_HOUR)
    async handleCron(){
        const endDate = new Date().toISOString();
        const start = new Date();
        start.setHours(new Date().getHours() -1);
        const startDate = start.toISOString();
        this.logger.log(`Running cron job with startDate ${startDate} and endDate ${endDate}`)
        return await this.analyze(startDate, endDate);
    }

    async analyze(startDate, endDate){
        try{            
            return await this.appService.analyze(startDate, endDate);
        } catch(e){
            this.logger.error('Cron job error: ', e.message);
            throw new HttpException(e.message, 500);
        }
    }
}