import { Body, Controller, Get, HttpException, HttpStatus, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiProperty
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { FilesInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FilesInterceptor('files'))
  async submitStory(@Body() body, @UploadedFiles() files: any){
    const {url, content, secret , email} = body;
    console.log('Submit story', body)
    const secretEnv = process.env.SECRET_ENV || '1v3r1fy';
    if(secret !== secretEnv ) return new HttpException('Not authorized.', 403);
    try {
      return await this.appService.createItemFromWp(url, content ,files , email)
    }catch(e){
      return new HttpException(e.message, 500)
    }
  }
   // test end point for UW
  // @Get('radio-messages')
  // @ApiTags('Radio Messages')
  // async testRadioMessages(){
  //   try{
  //     const created: number = await this.appService.pullRadioMessages();
  //     return created;
  //     console.log('Items created: ', created);
  // } catch(e){
  //     throw new HttpException(e.message, 500);
  // }

  // }
}
