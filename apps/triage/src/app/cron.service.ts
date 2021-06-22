import { HttpException, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppService } from "./app.service";

@Injectable()
export class CronService{
    private readonly logger = new Logger('CronService');

    constructor(private appService: AppService){}
    
    @Cron(CronExpression.EVERY_HOUR)
    async analyze(){
        try{
            const endDate = new Date().toISOString();
            const start = new Date();
            start.setHours(new Date().getHours() -1);
            const startDate = start.toISOString();
            this.logger.log(`Running cron job with startDate ${startDate} and endDate ${endDate}`)
            return await this.appService.analyze(startDate, endDate);
        } catch(e){
            this.logger.error('Cron job error: ', e.message);
            throw new HttpException(e.message, 500);
        }
    }
}