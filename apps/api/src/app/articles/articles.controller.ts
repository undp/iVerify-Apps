import { Article } from '@iverify/iverify-common';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';


@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post('save-article')
  async saveArticle(@Body() body: Partial<Article>) {
    return await this.articlesService.saveOne(body);
  }
  
}
