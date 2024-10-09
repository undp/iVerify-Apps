import { WpClientModule } from '@iverify/wp-client';
import { HttpModule, Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { WpPublisherHelper } from './wp-publisher-helper.service';
import { WpPublisherService } from './wp-publisher.service';
import { EmailModule } from '@iverify/email/src';

@Module({
  imports: [HttpModule, SharedModule, WpClientModule, EmailModule],
  providers: [WpPublisherService, WpPublisherHelper],
  exports: [WpPublisherService]
})
export class WpPublisherModule {}
