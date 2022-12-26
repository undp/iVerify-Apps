import { WpClientModule } from '@iverify/wp-client';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WpClientHandler } from '../../app/handlers/wpClientHandler.service';
import { LocationsModule } from '../../app/locations/locations.module';
import { Locations } from '../../app/locations/models/locations.model';

import { SharedModule } from '../shared/shared.module';
import { WpPublisherHelper } from './wp-publisher-helper.service';
import { WpPublisherService } from './wp-publisher.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Locations]),
        HttpModule,
        SharedModule,
        WpClientModule,
        LocationsModule,
    ],
    providers: [WpPublisherService, WpPublisherHelper, WpClientHandler],
    exports: [WpPublisherService],
})
export class WpPublisherModule {}
