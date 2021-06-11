import { HttpModule, Module } from '@nestjs/common';
import { MeedanCheckClientService } from './meedan-check-client.service';
import { CheckClientConfig } from './config';

@Module({
  controllers: [],
  providers: [MeedanCheckClientService, CheckClientConfig],
  imports: [HttpModule],
  exports: [MeedanCheckClientService],
})
export class MeedanCheckClientModule {}
