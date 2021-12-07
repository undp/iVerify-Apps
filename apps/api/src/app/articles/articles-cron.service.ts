import { HttpException, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { ArticlesService } from "./articles.service";
import { EmailService } from '@iverify/email';

@Injectable()
export class ArticlesCronService{
    private readonly logger = new Logger('ArticlesCronService');

    constructor(private articlesService: ArticlesService, private emailService: EmailService){}
    
    @Cron(CronExpression.EVERY_5_MINUTES)
    async handleCron(){
        const day = new Date();
        this.logger.log(`Running articles cron job for dat (UTC) ${day.toUTCString()}`);
        const articles = await this.articlesService.getArticles();
        return await this.emailService.sendCsvReport(articles) ;
    }
}