import { Module } from '@nestjs/common';

import { CrowdtangleClientModule } from '@iverify/crowdtangle-client';
import { MlServiceClientModule} from '@iverify/ml-service-client';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [CrowdtangleClientModule, MlServiceClientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
