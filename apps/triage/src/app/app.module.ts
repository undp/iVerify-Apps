import { HttpModule, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule'

import { CrowdtangleClientModule } from '@iverify/crowdtangle-client';
import { MlServiceClientModule} from '@iverify/ml-service-client';
import { MeedanCheckClientModule } from '@iverify/meedan-check-client';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TriageConfig } from './config';
import { CronService } from './cron.service';
import { PerspectiveClientModule } from '@iverify/perspective-client/src';

@Module({
  imports: [
    HttpModule, 
    CrowdtangleClientModule, 
    MlServiceClientModule, 
    PerspectiveClientModule,
    MeedanCheckClientModule, 
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, TriageConfig, CronService],
})
export class AppModule {}
