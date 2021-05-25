import { HttpModule, Module } from '@nestjs/common';
import { MeedanCheckClientService } from './meedan-check-client.service';

@Module({
  controllers: [],
  providers: [MeedanCheckClientService],
  imports: [HttpModule],
  exports: [MeedanCheckClientService],
})
export class MeedanCheckClientModule {}
