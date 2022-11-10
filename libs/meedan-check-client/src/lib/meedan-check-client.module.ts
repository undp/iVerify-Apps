import { DynamicModule, Module, Provider } from '@nestjs/common';
import { MeedanCheckClientService } from './meedan-check-client.service';
import { CheckClientHelperService } from './helper.service';
import { CheckStatsService } from './check-stats.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    controllers: [],
    providers: [
        MeedanCheckClientService,
        CheckClientHelperService,
        CheckStatsService,
    ],
    imports: [HttpModule],
    exports: [MeedanCheckClientService, CheckStatsService],
})
export class MeedanCheckClientModule {}
// @Module({})
// export class MeedanCheckClientModule {
//     private static readonly baseProviders: Array<Provider> = [
//         MeedanCheckClientService,
//         CheckClientConfig,
//         CheckClientHandlerService,
//         CheckStatsService
//     ];

//     private static readonly exportableProviders: Array<Provider> = [];

//     public static register(locationsService: any): DynamicModule {
//         const providers: Array<Provider> = [
//             ...this.baseProviders,
//             locationsService
//         ]

//         return {
//             module: MeedanCheckClientModule,
//             imports: [

//             ],
//             providers,
//             exports: [...this.exportableProviders],
//         }
//     }

//     public static registerAsync(config: ): DynamicModule {
//
//         return {
//             module: MeedanCheckClientModule,
//             imports: [],
//             providers,
//             exports: []
//         };
//     }
// }
