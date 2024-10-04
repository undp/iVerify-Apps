import { ApiClientService } from "@iverify/api-client/src";
import { HttpException, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { AppService } from "./app.service";

@Injectable()
export class CronService{
    private readonly logger = new Logger('CronService');

    constructor(private appService: AppService, private apiClient: ApiClientService){}

    // @Timeout(5000)
    // async handleTimeout(){
    //     const endDate = new Date().toISOString();
    //     const start = new Date();
    //     start.setHours(new Date().getHours() -1);
    //     const startDate = start.toISOString();
    //     this.logger.log(`Running initial job with startDate ${startDate} and endDate ${endDate}`)
    //     return await this.analyze(startDate, endDate);
    // }
    
    @Cron("*/10 * * * *")
    async handleCron(){
        const start = new Date();
        const startDate = start.toISOString();
        this.logger.log(`Running cron job with startDate ${startDate}`)
        return await this.analyze();
    }

    async analyze(){
        try{            
            const created: number = await this.appService.pullRadioMessages();
            console.log('Items created: ', created);
        } catch(e){
            this.logger.error('Cron job error: ', e.message);
            throw new HttpException(e.message, 500);
        }
    }
}