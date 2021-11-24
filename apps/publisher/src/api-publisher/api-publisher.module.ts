import { ApiClientModule } from '@iverify/api-client';
import { HttpModule, Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { ApiPublisherService } from './api-publisher.service';

@Module({
  imports: [HttpModule, SharedModule, ApiClientModule],
  providers: [ApiPublisherService],
  exports: [ApiPublisherService]
})
export class ApiPublisherModule {}
