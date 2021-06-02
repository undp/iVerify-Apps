import { Body, Controller, Post } from '@nestjs/common';
import { take } from 'rxjs/operators';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('meedan-reports')
  async publishMeedanReports(@Body() body){
    const id = body['id'];
    this.appService.publishReportById(id).pipe(take(1)).subscribe()
    try{
      return await this.appService.publishReportById(id).toPromise();
    }catch(e){
      
    }
  }
}
