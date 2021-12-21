import { HttpModule, Module } from '@nestjs/common';
import { PerspectiveConfig } from './config';
import { PerspectiveClientService } from './perspective-client.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [PerspectiveConfig, PerspectiveClientService],
  exports: [PerspectiveClientService],
})
export class PerspectiveClientModule {}
