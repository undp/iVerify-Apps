import { Module } from '@nestjs/common';


import { AppController } from './app.controller';
import { AppService } from './app.service';
import {MeedanCheckClientModule} from '@iverify/meedan-check-client';
import {WpClientModule} from '@iverify/wp-client';


@Module({
  imports: [
    MeedanCheckClientModule,
    WpClientModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
