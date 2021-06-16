import { HttpModule, Module } from '@nestjs/common';
import { MeedanCheckClientService } from './meedan-check-client.service';
import { CheckClientConfig } from './config';
import { CheckClientHelperService } from './helper.service';

@Module({
  controllers: [],
  providers: [MeedanCheckClientService, CheckClientConfig, CheckClientHelperService],
  imports: [HttpModule],
  exports: [MeedanCheckClientService],
})
export class MeedanCheckClientModule {}
