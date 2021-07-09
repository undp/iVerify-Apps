import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('alive-test')
  isAlive(){
    return 'I\'m alive...';
  }

  @Post('test-endpoint')
  async publishMeedanReports(@Body() body){
    const id = body['id'];
    return this.appService.publishReportById(id).pipe(
      catchError(err => {
        console.log(err)
        throw new HttpException(err.message, 500);
      })
    );
  }

  @Post('publish-webhook')
  async publishWebHook(@Body() body){
    const event = body['event'];
    const id = body.data.project_media.id;
    if(event === 'publish_report'){
      return this.appService.publishReportById(id).pipe(
        catchError(err => {
          throw new HttpException(err.message, 500);
        })
      );
    }
  }
}
