import { HttpModule, Module } from '@nestjs/common';


import { AppController } from './app.controller';
import { AppService } from './app.service';
import {MeedanCheckClientModule} from '@iverify/meedan-check-client';
import {WpClientModule} from '@iverify/wp-client';
import { SharedService } from './services/shared.service';


@Module({
  imports: [
    HttpModule,
    MeedanCheckClientModule,
    WpClientModule
  ],
  controllers: [AppController],
  providers: [AppService, SharedService],
})
export class AppModule {}
