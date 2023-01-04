import { ApiClientModule } from '@iverify/api-client';
import { Article } from '@iverify/iverify-common/src';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesModule } from '../../app/articles/articles.module';
import { ArticlesService } from '../../app/articles/articles.service';
import { LocationsModule } from '../../app/locations/locations.module';
import { Locations } from '../../app/locations/models/locations.model';
import { SharedModule } from '../shared/shared.module';
import { ApiPublisherService } from './api-publisher.service';
import { ApiPublisherHelper } from './helper';

@Module({
    imports: [
        TypeOrmModule.forFeature([Article, Locations]),
        HttpModule,
        SharedModule,
        ApiClientModule,
        ArticlesModule,
        LocationsModule,
    ],
    providers: [ApiPublisherService, ApiPublisherHelper, ArticlesService],
    exports: [ApiPublisherService],
})
export class ApiPublisherModule {}
