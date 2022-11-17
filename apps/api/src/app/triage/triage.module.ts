import { Module } from '@nestjs/common';

import { CrowdtangleClientModule } from '@iverify/crowdtangle-client';
import { MlServiceClientModule } from '@iverify/ml-service-client';
import { MeedanCheckClientModule } from '@iverify/meedan-check-client';
import { HttpModule } from '@nestjs/axios';

import { PerspectiveClientModule } from '@iverify/perspective-client/src';

import { ApiClientModule, ApiClientService } from '@iverify/api-client/src';
import { ScheduleModule } from '@nestjs/schedule';

import { TriageCronService } from './triage.cron.service';
import { TriageController } from './triage.controller';
import { TriageService } from './triage.service';
import { LocationsModule } from '../locations/locations.module';
import { CheckClientHandlerService } from '../handlers/checkStatsClientHandler.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TriagePostControl } from './models/triage.post.control.model';

import { Locations } from '../locations/models/locations.model';

import { ApiClientHandler } from '../apiClientHandler.service';
import { CrowdtangleClientHandler } from '../handlers/CrowdtangleClientHandler.service';
import { MLServiceClientHandler } from '../handlers/mlServiceClientHandler.service';
import { PerpesctiveClientHandler } from '../handlers/perspectiveClientHandler.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([TriagePostControl, Locations]),
        HttpModule,
        CrowdtangleClientModule,
        MlServiceClientModule,
        PerspectiveClientModule,
        MeedanCheckClientModule,
        ApiClientModule,
        ScheduleModule.forRoot(),
        LocationsModule,
    ],
    controllers: [TriageController],
    providers: [
        TriageCronService,
        TriageService,
        CheckClientHandlerService,
        CrowdtangleClientHandler,
        ApiClientHandler,
        PerpesctiveClientHandler,
        MLServiceClientHandler,
    ],
    exports: [TriageService],
})
export class TriageModule {}
