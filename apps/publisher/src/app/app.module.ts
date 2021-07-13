import { Module } from '@nestjs/common';


import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from '../shared/shared.module';
import { WpPublisherModule } from '../wp-publisher/wp-publisher.module';
import { MeedanCheckClientModule } from '@iverify/meedan-check-client';
import { WpClientModule } from '@iverify/wp-client';


@Module({
  imports: [
    SharedModule,
    WpPublisherModule,
    MeedanCheckClientModule,
    WpClientModule
  ],
  controllers: [AppController],
  providers: [
    AppService, 
  ],
})
export class AppModule {}
