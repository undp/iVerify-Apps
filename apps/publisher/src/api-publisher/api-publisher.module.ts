import { ApiClientModule } from '@iverify/api-client';
import { HttpModule, Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { ApiPublisherService } from './api-publisher.service';
import { ApiPublisherHelper } from './helper';

@Module({
  imports: [HttpModule, SharedModule, ApiClientModule],
  providers: [ApiPublisherService, ApiPublisherHelper],
  exports: [ApiPublisherService]
})
export class ApiPublisherModule {}
