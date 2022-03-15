import { HttpModule, Module } from '@nestjs/common';


import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from '../shared/shared.module';
import { WpPublisherModule } from '../wp-publisher/wp-publisher.module';
import { MeedanCheckClientModule } from '@iverify/meedan-check-client';
import { ApiClientModule } from '@iverify/api-client';
import { WpClientModule } from '@iverify/wp-client';
import { ApiPublisherModule } from '../api-publisher/api-publisher.module';


@Module({
  imports: [
    SharedModule,
    WpPublisherModule,
    MeedanCheckClientModule,
    WpClientModule,
    ApiPublisherModule,
    ApiClientModule,
    HttpModule
  ],
  controllers: [AppController],
  providers: [
    AppService, 
  ],
})
export class AppModule {}
