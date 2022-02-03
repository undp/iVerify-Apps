import { Article } from '@iverify/iverify-common';
import { Body, Controller, Get, HttpException, Logger, Post, UseGuards } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { StatsFormatService } from '../stats/stats-format.service';
import { StatsService } from '../stats/stats.service';
import { ArticlesService } from './articles.service';


@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  private readonly logger = new Logger('ArticlesController');

  constructor(
    private readonly articlesService: ArticlesService, 
    private statsService: StatsService, 
    private formatService: StatsFormatService
    ) {}

  @Post('save-article')
  async saveArticle(@Body() body) {
    try{
      const article = body.article;
      this.logger.log('Received request on save article endpoint');
      await this.articlesService.saveOne(article);
      if(article && article.dToxicScore) {
        this.logger.log('Article has a toxic score; updating detoxify indicators...');
        await this.statsService.addToxicPublishedStats(article);
      }
      return 'ok';
    } catch(e){
      console.log('Error while saving article...', e.message);
      throw new HttpException(e.message, 500); 
    }
  }

  @Get('articles')
  async getArticles() {
    try{
      return await this.articlesService.getArticles();
    } catch(e){
      console.log('Error while getting articles...');
      throw new HttpException(e.message, 500); 
    }
  }


  
}
