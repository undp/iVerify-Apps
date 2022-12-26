import { ApiClientModule } from '@iverify/api-client/src';
import { MeedanCheckClientModule } from '@iverify/meedan-check-client/src';
import { WpClientModule } from '@iverify/wp-client/src';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ApiPublisherModule } from './api-publisher/api-publisher.module';
import { PublisherController } from './publisher.controller';
import { PublisherService } from './publisher.service';
import { SharedModule } from './shared/shared.module';
import { WpPublisherModule } from './wp-publisher/wp-publisher.module';

@Module({
    imports: [
        SharedModule,
        WpPublisherModule,
        MeedanCheckClientModule,
        WpClientModule,
        ApiPublisherModule,
        ApiClientModule,
        HttpModule,
    ],
    controllers: [PublisherController],
    providers: [PublisherService],
})
export class PublisherModule {}
