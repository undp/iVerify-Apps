import { Body, Controller, Get, Post } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('meedan-reports')
  publishMeedanReports(@Body() body){
    const id = body['id'];
    return this.appService.publishReportById(id);    
  }
}
