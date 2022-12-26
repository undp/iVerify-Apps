import { MeedanCheckClientModule } from '@iverify/meedan-check-client';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckClientHandlerService } from '../../app/handlers/checkStatsClientHandler.service';
import { LocationsModule } from '../../app/locations/locations.module';
import { Locations } from '../../app/locations/models/locations.model';
import { SharedHelper } from './helper';
import { SharedService } from './shared.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Locations]),
        MeedanCheckClientModule,
        LocationsModule,
    ],
    providers: [SharedService, SharedHelper, CheckClientHandlerService],
    exports: [SharedService, SharedHelper],
})
export class SharedModule {}
