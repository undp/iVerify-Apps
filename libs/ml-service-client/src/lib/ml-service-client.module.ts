import { Module } from '@nestjs/common';
import { MlServiceConfig } from './config';
import { MlServiceClientService } from './ml-service-client.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    controllers: [],
    providers: [MlServiceConfig, MlServiceClientService],
    exports: [MlServiceClientService],
})
export class MlServiceClientModule {}
