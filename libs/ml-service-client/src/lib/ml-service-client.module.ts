import { HttpModule, Module } from '@nestjs/common';
import { MlServiceConfig } from './config';
import { MlServiceClientService } from './ml-service-client.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [MlServiceConfig, MlServiceClientService],
  exports: [MlServiceClientService],
})
export class MlServiceClientModule {}
