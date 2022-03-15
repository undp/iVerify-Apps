import { HttpModule, HttpService, Module } from '@nestjs/common';
import { MeedanCheckClientService } from './meedan-check-client.service';
import { CheckClientConfig } from './config';
import { CheckClientHelperService } from './helper.service';
import { CheckStatsService } from './check-stats.service';

@Module({
  controllers: [],
  providers: [MeedanCheckClientService, CheckClientConfig, CheckClientHelperService, CheckStatsService],
  imports: [HttpModule],
  exports: [MeedanCheckClientService, CheckStatsService],
})
export class MeedanCheckClientModule {}
