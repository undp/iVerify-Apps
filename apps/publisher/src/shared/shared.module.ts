import { MeedanCheckClientModule } from '@iverify/meedan-check-client';
import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';

@Module({
  imports: [MeedanCheckClientModule],
  providers: [SharedService],
  exports: [SharedService]
})
export class SharedModule {}
