import { Module } from '@nestjs/common';

import { CrowdtangleClientModule } from '@iverify/crowdtangle-client';
import { MlServiceClientModule} from '@iverify/ml-service-client';
import { MeedanCheckClientModule } from '@iverify/meedan-check-client';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TriageConfig } from './config';

@Module({
  imports: [CrowdtangleClientModule, MlServiceClientModule, MeedanCheckClientModule],
  controllers: [AppController],
  providers: [AppService, TriageConfig],
})
export class AppModule {}
