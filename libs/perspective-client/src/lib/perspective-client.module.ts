import { Module } from '@nestjs/common';
import { PerspectiveClientService } from './perspective-client.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    controllers: [],
    providers: [PerspectiveClientService],
    exports: [PerspectiveClientService],
})
export class PerspectiveClientModule {}
