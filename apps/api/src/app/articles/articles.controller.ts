import { Article } from '@iverify/iverify-common';
import { Body, Controller, Get, HttpException, Post, UseGuards } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';


@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post('save-article')
  async saveArticle(@Body() body) {
    try{
      const article = body.article;
      await this.articlesService.saveOne(article);
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
