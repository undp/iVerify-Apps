import { Module } from '@nestjs/common';
import { CrowdtangleClientConfig } from './config';
import { CrowdtangleClientService } from './crowdtangle-client.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    controllers: [],
    providers: [CrowdtangleClientService, CrowdtangleClientConfig],
    exports: [CrowdtangleClientService],
})
export class CrowdtangleClientModule {}
