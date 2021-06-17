import { Module } from '@nestjs/common';


import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from '../shared/shared.module';
import { WpPublisherModule } from '../wp-publisher/wp-publisher.module';


@Module({
  imports: [
    SharedModule,
    WpPublisherModule
  ],
  controllers: [AppController],
  providers: [
    AppService, 
  ],
})
export class AppModule {}
