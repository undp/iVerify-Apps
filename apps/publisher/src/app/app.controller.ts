import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('meedan-reports')
  async publishMeedanReports(@Body() body){
    const id = body['id'];
    return this.appService.publishReportById(id).pipe(
      catchError(err => {
        throw new HttpException(err.message, 500);
      })
    );
    // const event = body['event'];
    // const id = body.data.project_media.id;
    // if(event === 'publish_report'){
    // return this.appService.publishReportById(id);
    // }else{
    //   return null;
    // }
  }
}
