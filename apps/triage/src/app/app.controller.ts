import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiProperty
} from '@nestjs/swagger';
import { AppService } from './app.service';

class SubmitStoryDto {
  @ApiProperty()
  url: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  secret: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: false,
  })
  files?: any[];

  @ApiProperty()
  email: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('submit-story')
  @ApiTags('Submit story')
  @ApiBody({ type: SubmitStoryDto })
  async submitStory(@Body() body){
    const {url, content, secret , files , email} = body;
    console.log('Submit story', body)
    const secretEnv = process.env.SECRET_ENV || '1v3r1fy';
    if(secret !== secretEnv ) return new HttpException('Not authorized.', 403);
    try {
      return await this.appService.createItemFromWp(url, content ,files , email)
    }catch(e){
      return new HttpException(e.message, 500)
    }
  }
}
