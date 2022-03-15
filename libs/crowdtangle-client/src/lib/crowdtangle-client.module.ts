import { HttpModule, Module } from '@nestjs/common';
import { CrowdtangleClientConfig } from './config';
import { CrowdtangleClientService } from './crowdtangle-client.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [CrowdtangleClientService, CrowdtangleClientConfig],
  exports: [CrowdtangleClientService],
})
export class CrowdtangleClientModule {}
