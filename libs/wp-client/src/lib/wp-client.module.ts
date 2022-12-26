import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { WpClientService } from './wp-client.service';

@Module({
    imports: [HttpModule],
    controllers: [],
    providers: [WpClientService],
    exports: [WpClientService],
})
export class WpClientModule {}
