import { HttpException, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression} from '@nestjs/schedule';
import { AppService } from "./app.service";

@Injectable()
export class CronService{
    private readonly logger = new Logger('CronService');

    constructor(private appService: AppService){}

    @Cron(CronExpression.EVERY_MINUTE)
    async handleCron(){
        const start = new Date();
        const startDate = start.toISOString();
        this.logger.log(`Running cron job with startDate ${startDate}`)
        return await this.analyze();
    }

    async analyze(){
        try{
            const created = await this.appService.notifySubscribers();
            console.log('Items created: ', created);
        } catch(e){
            this.logger.error('Cron job error: ', e.message);
            throw new HttpException(e.message, 500);
        }
    }
}
