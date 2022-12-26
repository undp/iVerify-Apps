import { MlServiceConfig } from '@iverify/ml-service-client/src/lib/config';
import { MlServiceClientService } from '@iverify/ml-service-client/src/lib/ml-service-client.service';
import { Injectable } from '@nestjs/common';
import { from, switchMap } from 'rxjs';
import { LocationsService } from '../locations/locations.service';

@Injectable()
export class MLServiceClientHandler {
    constructor(
        private locationsService: LocationsService,
        private mlServiceClientService: MlServiceClientService
    ) {}
    private async getConfigByLocation(
        locationId: string
    ): Promise<MlServiceConfig> {
        const { params } = await this.locationsService.findById(locationId);

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
