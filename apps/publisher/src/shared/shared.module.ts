import { MeedanCheckClientModule } from '@iverify/meedan-check-client';
import { Module } from '@nestjs/common';
import { SharedHelper } from './helper';
import { SharedService } from './shared.service';

@Module({
  imports: [MeedanCheckClientModule],
  providers: [SharedService, SharedHelper],
  exports: [SharedService, SharedHelper]
})
export class SharedModule {}
