import { MeedanCheckClientService } from '@iverify/meedan-check-client';
import { Body, Controller, Get, HttpException, HttpService, Logger, Post } from '@nestjs/common';
import { WpClientService } from 'libs/wp-client/src/lib/wp-client.service';
import { catchError, tap } from 'rxjs/operators';
import {
  ApiBody,
  ApiTags,
  ApiProperty
} from '@nestjs/swagger';
import { AppService } from './app.service';



class PublishReportDto {
  @ApiProperty()
  event: string;

  @ApiProperty()
  data: {
    project_media: {
      dbid: number | string;
    }
  };
}

@Controller()
export class AppController {
  private readonly logger = new Logger('PublisherAppService');

  constructor(
    private readonly appService: AppService,
    ) {}

  @Post('publish-webhook')
  @ApiTags('Publish Report')
  @ApiBody({ type: PublishReportDto })
  async punlishReportWebhook(@Body() body){
    try{
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


  // @Get('subscribers')
  // @ApiTags('subscribers')
  // async subscribers(){
  //   try{
  //    return this.appService.notifySubscribers();
  //   }catch(e){
  //     return new HttpException(e.message, 500)
  //   }
  // }

}
