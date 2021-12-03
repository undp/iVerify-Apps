import { HttpModule, Module } from '@nestjs/common';
import { ApiClientService } from './api-client.service';
import { ApiClientConfig } from './config';

@Module({
  controllers: [],
  imports: [HttpModule],
  providers: [ApiClientService, ApiClientConfig],
  exports: [ApiClientService],
})
export class ApiClientModule {}
