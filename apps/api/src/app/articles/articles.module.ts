import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Article } from "@iverify/iverify-common";
import { ArticlesService } from "./articles.service";
import { ArticlesController } from "./articles.controller";
import { EmailModule } from '@iverify/email';
import { ArticlesCronService } from "./articles-cron.service";
import { StatsModule } from "../stats/stats.module";

@Module({
    imports: [TypeOrmModule.forFeature([Article]), EmailModule, StatsModule],
    controllers: [ArticlesController],
    providers: [ArticlesService, ArticlesCronService]
})
export class ArticlesModule{}