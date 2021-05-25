import { Body, Controller, Get, Post } from '@nestjs/common';
import { MeedanCheckClientService } from 'libs/meedan-check-client/src/lib/meedan-check-client.service';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private checkClient: MeedanCheckClientService) {}

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
