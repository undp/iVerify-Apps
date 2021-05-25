import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {MeedanCheckClientModule} from '@iverify/meedan-check-client';

@Module({
  imports: [MeedanCheckClientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
