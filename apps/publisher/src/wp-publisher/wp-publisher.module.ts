import { WpClientModule } from '@iverify/wp-client';
import { HttpModule, Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { WpPublisherService } from './wp-publisher.service';

@Module({
  imports: [HttpModule, SharedModule, WpClientModule],
  providers: [WpPublisherService],
  exports: [WpPublisherService]
})
export class WpPublisherModule {}
