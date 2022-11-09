import { Module } from '@nestjs/common';
import { ApiClientService } from './api-client.service';
import { ApiClientConfig } from './config';
import { HttpModule } from '@nestjs/axios';

@Module({
    controllers: [],
    imports: [HttpModule],
    providers: [ApiClientService, ApiClientConfig],
    exports: [ApiClientService],
})
export class ApiClientModule {}
