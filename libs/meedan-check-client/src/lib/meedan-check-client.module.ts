import { HttpModule, HttpService, Module } from '@nestjs/common';
import { MeedanCheckClientService } from './meedan-check-client.service';
import { CheckClientConfig } from './config';
import { CheckClientHelperService } from './helper.service';
import { CheckStatsService } from './check-stats.service';
import { S3Module } from '@iverify/s3/src/lib/s3.module';

@Module({
  controllers: [],
  providers: [MeedanCheckClientService, CheckClientConfig, CheckClientHelperService, CheckStatsService],
  imports: [HttpModule,S3Module],
  exports: [MeedanCheckClientService, CheckStatsService],
})
export class MeedanCheckClientModule {}
