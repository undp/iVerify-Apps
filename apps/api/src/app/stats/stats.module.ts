import { StatusesMap } from "@iverify/iverify-common";
import { MeedanCheckClientModule, MeedanCheckClientService } from "@iverify/meedan-check-client";
import { HttpModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CheckStatsService } from "libs/meedan-check-client/src/lib/check-stats.service";
import { Stats } from "./models/stats.model";
import { StatsController } from "./stats-controller";
import { StatsFormatService } from "./stats-format.service";
import { StatsService } from "./stats.service";

@Module({
    imports: [TypeOrmModule.forFeature([Stats]), MeedanCheckClientModule],
    controllers: [StatsController],
    providers: [StatsService, StatsFormatService],
    exports: [StatsFormatService, StatsService]
})
export class StatsModule{}