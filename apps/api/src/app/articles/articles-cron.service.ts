import { HttpException, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { ArticlesService } from "./articles.service";
import { EmailService } from '@iverify/email';
import { StatsFormatService } from "../stats/stats-format.service";

@Injectable()
export class ArticlesCronService{
    private readonly logger = new Logger('ArticlesCronService');

    constructor(
        private articlesService: ArticlesService, 
        private emailService: EmailService,
        private formatService: StatsFormatService
        ){}
    
    @Cron(CronExpression.EVERY_DAY_AT_6AM)
    async handleCron(){
        try{
            const startDate = new Date();
            const start = new Date(startDate.getTime());
            start.setHours(startDate.getHours() -24);

            const endDate = new Date();
            const end = new Date(endDate.getTime());
            end.setHours(endDate.getHours());

            const formattedStart = this.formatService.formatDate(start);
            const formattedEnd = this.formatService.formatDate(end);
            this.logger.log(`Running articles cron job for date (UTC) ${endDate.toUTCString()}`);
            const articles = await this.articlesService.getArticles();
            return await this.emailService.sendCsvReport(articles, formattedEnd) ;
        }catch(e){
            this.logger.error(e.message)
        }
    }
}