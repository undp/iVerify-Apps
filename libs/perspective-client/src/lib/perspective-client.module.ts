import { Module } from '@nestjs/common';
import { PerspectiveConfig } from './config';
import { PerspectiveClientService } from './perspective-client.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    controllers: [],
    providers: [PerspectiveConfig, PerspectiveClientService],
    exports: [PerspectiveClientService],
})
export class PerspectiveClientModule {}
