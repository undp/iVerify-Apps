import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { take } from 'rxjs/operators';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('meedan-reports')
  async publishMeedanReports(@Body() body){
    const event = body['event'];
    const id = body.data.project_media.id;
    if(event === 'published_report'){
      this.appService.publishReportById(id).pipe(take(1)).subscribe();
      return await this.appService.publishReportById(id).toPromise();
    }else{
      return null;
    }
  }
}
