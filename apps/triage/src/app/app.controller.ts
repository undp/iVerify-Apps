import { Body, Controller, Get, Post } from '@nestjs/common';

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

  // @Post('submit-story')
  // async submitStory(@Body() body){
  //   const startDate = body['startDate'];
  //   const endDate = body['endDate']
  //   return await this.appService.analyze(startDate, endDate)
  // }
}
