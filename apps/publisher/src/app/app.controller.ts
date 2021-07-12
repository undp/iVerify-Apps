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
    const parsed = JSON.parse(body)
    const event = parsed.event;
    const id = parsed.data.project_media.id;
    const folderId = parsed.data.project_media.project.dbid;
    if(event === 'event_project_media' && folderId === process.env.CHECK_FOLDER_ID){
      return this.appService.publishReportById(id).pipe(
        catchError(err => {
          throw new HttpException(err.message, 500);
        })
      );
    } else {
      return null
    }
  }
}
