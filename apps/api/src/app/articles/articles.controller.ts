import { Article } from '@iverify/iverify-common';
import { Body, Controller, HttpException, Post, UseGuards } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';


@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post('save-article')
  async saveArticle(@Body() body: Partial<Article>) {
    try{
      return await this.articlesService.saveOne(body);
    } catch(e){
      console.log('Error while saving article...');
      throw new HttpException(e.message, 500); 
    }
  }
  
}
