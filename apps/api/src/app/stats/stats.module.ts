import { MeedanCheckClientModule } from '@iverify/meedan-check-client';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stats } from './models/stats.model';
import { StatsController } from './stats-controller';
import { StatsFormatService } from './stats-format.service';
import { StatsService } from './stats.service';

@Module({
    imports: [TypeOrmModule.forFeature([Stats]), MeedanCheckClientModule],
    controllers: [StatsController],
    providers: [StatsService, StatsFormatService],
    exports: [StatsFormatService, StatsService],
})
export class StatsModule {}
