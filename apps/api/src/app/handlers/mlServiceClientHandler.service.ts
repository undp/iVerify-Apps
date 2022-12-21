import { MlServiceConfig } from '@iverify/ml-service-client/src/lib/config';
import { MlServiceClientService } from '@iverify/ml-service-client/src/lib/ml-service-client.service';
import { Injectable, Logger } from '@nestjs/common';
import { toArray } from 'lodash';
import { isEmpty } from 'radash';
import { from, switchMap } from 'rxjs';
import { LocationsService } from '../locations/locations.service';

@Injectable()
export class MLServiceClientHandler {
    private logger = new Logger(MLServiceClientHandler.name);

    constructor(
        private locationsService: LocationsService,
        private mlServiceClientService: MlServiceClientService
    ) {}
    private async getConfigByLocation(
        locationId: string
    ): Promise<MlServiceConfig> {
        let { params } = await this.locationsService.findById(locationId);

        if (isEmpty(params)) {
            const error = `Params not found for location ${locationId}`;
            this.logger.error(error);
            throw new Error(error);
        }

        if (!Array.isArray(params)) {
            params = toArray(params);
        }

        const getParam: any = (param) =>
            params.find(({ key }) => key === param);

        const apiBase = getParam('ML_SERVICE_API_BASE')?.value;

        const requestConfig: MlServiceConfig = {
            endpoints: {
                analyze: `${apiBase}/analyze`,
            },
            apiBase,
        };

        return requestConfig;
    }

    analyze(locationId: string, messages: string[]) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.mlServiceClientService.analyze(
                    requestConfig,
                    messages
                );
            })
        );
    }
}
