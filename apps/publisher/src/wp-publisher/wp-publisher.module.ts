import { WpClientModule } from '@iverify/wp-client';
import { HttpModule, Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { WpPublisherHelper } from './wp-publisher-helper.service';
import { WpPublisherService } from './wp-publisher.service';

@Module({
  imports: [HttpModule, SharedModule, WpClientModule],
  providers: [WpPublisherService, WpPublisherHelper],
  exports: [WpPublisherService]
})
export class WpPublisherModule {}
