import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async testEndpoint(@Body() body){
    const startDate = body['startDate'];
    const endDate = body['endDate']
    return await this.appService.analyze(startDate, endDate)
  }

  @Post('submit-story')
  async submitStory(@Body() body){
    const {title, description, secret} = body;
    if(secret !== '1v3r1fy') return new HttpException('Not authorized.', 403);
    try{
      return await this.appService.createItemFromWp(title, description)
    }catch(e){
      return new HttpException(e.message, 500)
    }
  }
}
