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
import { UnitedwaveClientModule } from '@iverify/unitedwave-client';
import { ApiClientModule, ApiClientService } from '@iverify/api-client/src';
import { TranslateService } from './TranslateService/TranslateService';
import { AuthModule } from '@iverify/auth';
import { AuthService } from '@iverify/auth/src/lib/auth.service';
@Module({
  imports: [
    HttpModule,
    CrowdtangleClientModule,
    MlServiceClientModule,
    PerspectiveClientModule,
    MeedanCheckClientModule,
    UnitedwaveClientModule,
    ApiClientModule,
    ScheduleModule.forRoot(),
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService, TriageConfig, CronService, TranslateService, AuthService],
})
export class AppModule {}
