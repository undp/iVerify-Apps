import { HttpModule, Module } from '@nestjs/common';


import { AppController } from './app.controller';
import { AppService } from './app.service';
import {MeedanCheckClientModule} from '@iverify/meedan-check-client';
import {WpClientModule} from '@iverify/wp-client';
import { SharedModule } from '../shared/shared.module';
import { WpPublisherModule } from '../wp-publisher/wp-publisher.module';


@Module({
  imports: [
    SharedModule,
    WpPublisherModule
  ],
  controllers: [AppController],
  providers: [
    AppService, 
  ],
})
export class AppModule {}
