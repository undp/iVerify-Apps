import { ApiClientService } from '@iverify/api-client/src';
import {
    HttpException,
    Injectable,
    Logger,
    OnModuleInit,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { lastValueFrom } from 'rxjs';
import { LocationsService } from '../locations/locations.service';
import { TriageService } from './triage.service';
import * as pMap from 'p-map';
import { ApiClientHandler } from '../apiClientHandler.service';
import { isEmpty } from 'radash';
import { Locations } from '../locations/models/locations.model';
// import { AppService } from './app.service';

@Injectable()
export class TriageCronService implements OnModuleInit {
    private readonly logger = new Logger(TriageCronService.name);

    private lastCalledLocation: Locations;

    constructor(
        // private appService: AppService,
        private triageService: TriageService,
        private apiClient: ApiClientHandler,
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

    onModuleInit() {
        // this.preparePostsCron();
    }

    private getNextLocation(locations: Array<Locations>): Locations {
        if (isEmpty(locations)) {
            return null;
        }

        if (isEmpty(this.lastCalledLocation)) {
            this.lastCalledLocation = locations[0];
        } else {
            const currentIndex = locations.findIndex(
                (location: Locations) =>
                    location.id === this.lastCalledLocation.id
            );

            if (currentIndex <= locations.length) {
                this.lastCalledLocation = locations[currentIndex];
            } else {
                this.lastCalledLocation = locations[0];
            }
        }

        return this.lastCalledLocation;
    }

    @Cron(CronExpression.EVERY_30_MINUTES)
    async preparePostsCron() {
        const endDate = new Date().toISOString();
        const start = new Date();
        start.setMinutes(new Date().getMinutes() - 30);
        const startDate = start.toISOString();
        this.logger.log(
            `Running cron job preparePostsCron with startDate ${startDate} and endDate ${endDate}`
        );

        const locations = (await this.locationsService.findAll({
            limit: Number.MAX_SAFE_INTEGER,
            offset: 0,
        })) as unknown as Array<Locations>;

        let process = true;

        while (process) {
            try {
                const { id } = this.getNextLocation(locations);

                await this.triageService.prepareListAndPosts(
                    id,
                    startDate,
                    endDate
                );
            } catch (err) {
                process = false;
                this.logger.error(err);
                throw err;
            }
        }
    }

    @Cron(CronExpression.EVERY_2_HOURS)
    async processPostsCron() {
        this.logger.log(`Running cron job processPostsCron`);

        const locations = (await this.locationsService.findAll({
            limit: Number.MAX_SAFE_INTEGER,
            offset: 0,
        })) as unknown as Array<Locations>;

        let process = true;

        while (process) {
            try {
                const { id } = this.getNextLocation(locations);

                await this.analyze(id);
            } catch (err) {
                process = false;
                this.logger.error(err);
                throw err;
            }
        }
    }

    async analyze(locationId: string) {
        try {
            const created: number = await this.triageService.analyze(
                locationId
            );
            this.logger.log('Items created: ', created);
            return await lastValueFrom(
                this.apiClient.postToxicStats(locationId, created)
            );
        } catch (e) {
            this.logger.error('Cron job error: ', e.message);
            throw new HttpException(e.message, 500);
        }
    }
}
