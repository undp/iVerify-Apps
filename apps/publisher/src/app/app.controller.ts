import { Body, Controller, Post } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('meedan-reports')
  async publishMeedanReports(@Body() body){
    const id = body['id'];
    return this.appService.publishReportById(id);
    // const event = body['event'];
    // const id = body.data.project_media.id;
    // if(event === 'publish_report'){
    // return this.appService.publishReportById(id);
    // }else{
    //   return null;
    // }
  }
}
