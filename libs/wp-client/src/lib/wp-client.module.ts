import { HttpModule, Module } from '@nestjs/common';
import { WpConfig } from './config';
import { WpClientService } from './wp-client.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [WpClientService, WpConfig],
  exports: [WpClientService],
})
export class WpClientModule {}
