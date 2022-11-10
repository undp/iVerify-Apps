import { ApiClientService } from '@iverify/api-client/src';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { lastValueFrom } from 'rxjs';
import { LocationsService } from '../locations/locations.service';
import { TriageService } from './triage.service';
import * as pMap from 'p-map';
// import { AppService } from './app.service';

@Injectable()
export class TriageCronService {
    private readonly logger = new Logger(TriageCronService.name);

    constructor(
        // private appService: AppService,
        private triageService: TriageService,
        private apiClient: ApiClientService,
        private locationsService: LocationsService
    ) {}

    // @Timeout(5000)
    // async handleTimeout(){
    //     const endDate = new Date().toISOString();
    //     const start = new Date();
    //     start.setHours(new Date().getHours() -1);
    //     const startDate = start.toISOString();
    //     this.logger.log(`Running initial job with startDate ${startDate} and endDate ${endDate}`)
    //     return await this.analyze(startDate, endDate);
    // }

    @Cron(CronExpression.EVERY_2_HOURS)
    async handleCron() {
        const endDate = new Date().toISOString();
        const start = new Date();
        start.setHours(new Date().getHours() - 2);
        const startDate = start.toISOString();
        this.logger.log(
            `Running cron job with startDate ${startDate} and endDate ${endDate}`
        );

        const locations = await this.locationsService.findAll({
            limit: Infinity,
            offset: 0,
        });

        const result = await pMap(
            locations,
            async ({ id: locationId }) => {
                return this.analyze(locationId, startDate, endDate);
            },
            {
                concurrency: 2,
                stopOnError: false,
            }
        );

        return result;
    }

    async analyze(locationId: string, startDate, endDate) {
        try {
            const created: number = await this.triageService.analyze(
                locationId,
                startDate,
                endDate
            );
            this.logger.log('Items created: ', created);
            return await lastValueFrom(this.apiClient.postToxicStats(created));
        } catch (e) {
            this.logger.error('Cron job error: ', e.message);
            throw new HttpException(e.message, 500);
        }
    }
}
