import { MeedanCheckClientService } from '@iverify/meedan-check-client';
import { Body, Controller, Get, HttpException, HttpService, Logger, Post } from '@nestjs/common';
import { WpClientService } from 'libs/wp-client/src/lib/wp-client.service';
import { catchError, tap } from 'rxjs/operators';

import { AppService } from './app.service';



@Controller()
export class AppController {
  private readonly logger = new Logger('PublisherAppService');
  
  constructor(
    private readonly appService: AppService,
    ) {}

  @Post('publish-webhook')
  async punlishReportWebhook(@Body() body){
    try{
      const WP_USERNAME = process.env.WP_USERNAME;
      console.log('WP_USERNAME: ', WP_USERNAME);
      const WP_PASSWORD = process.env.WP_PASSWORD;
      console.log('WP_PASSWORD: ', WP_PASSWORD);
      const CHECK_API_URL = process.env.CHECK_API_URL;
      console.log('CHECK_API_URL: ', CHECK_API_URL);
      const CHECK_API_TOKEN = process.env.CHECK_API_TOKEN;
      console.log('CHECK_API_TOKEN: ', CHECK_API_TOKEN);
      const event = body.event;
      this.logger.log(`Received event: ${event}`);
      const data = body.data;
      const id = data.project_media.dbid;
      this.logger.log(`project media id: ${id}`)
      if(event === 'publish_report'){
        return this.appService.publishReportById(id).pipe(
          tap(() => this.logger.log('Report published.')),
          catchError(err => {
            this.logger.error(err);
            throw new HttpException(err.message, 500);
          })
        );
      }
      return null;
    }catch(e){
      return new HttpException(e.message, 500)
    }
  }

  @Post('publish-test-endpoint')
  async punlishTestEndpoint(@Body() body){
    try{
      const WP_USERNAME = process.env.WP_USERNAME;
      console.log('WP_USERNAME: ', WP_USERNAME);
      const WP_PASSWORD = process.env.WP_PASSWORD;
      console.log('WP_PASSWORD: ', WP_PASSWORD);
      const CHECK_API_URL = process.env.CHECK_API_URL;
      console.log('CHECK_API_URL: ', CHECK_API_URL);
      const CHECK_API_TOKEN = process.env.CHECK_API_TOKEN;
      console.log('CHECK_API_TOKEN: ', CHECK_API_TOKEN);
      const id = body.id;
      this.logger.log(`project media id: ${id}`)
      return this.appService.publishReportById(id).pipe(
        tap(() => this.logger.log('Report published.')),
        catchError(err => {
          this.logger.error(err);
          throw new HttpException(err.message, 500);
        })
      );      
    }catch(e){
      return new HttpException(e.message, 500)
    }
  }
}
