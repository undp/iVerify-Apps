import { MeedanCheckClientModule } from '@iverify/meedan-check-client';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsModule } from '../locations/locations.module';
import { Locations } from '../locations/models/locations.model';
import { CheckClientHandlerService } from '../handlers/checkStatsClientHandler.service';
import { Stats } from './models/stats.model';
import { StatsController } from './stats-controller';
import { StatsFormatService } from './stats-format.service';
import { StatsService } from './stats.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        TypeOrmModule.forFeature([Locations, Stats]),
        MeedanCheckClientModule,
        LocationsModule,
        HttpModule,
    ],
    controllers: [StatsController],
    providers: [StatsService, StatsFormatService, CheckClientHandlerService],
    exports: [StatsFormatService, StatsService],
})
export class StatsModule {}
