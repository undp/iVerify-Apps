import { UnitedwaveClientConfig } from './config';
import { UnitedwaveClientService } from './unitedwave-client.service';
import { HttpModule, Module } from '@nestjs/common';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [UnitedwaveClientService, UnitedwaveClientConfig],
  exports: [UnitedwaveClientService],
})
export class UnitedwaveClientModule {}
