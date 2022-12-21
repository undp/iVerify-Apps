import { PerspectiveConfig } from '@iverify/perspective-client/src/lib/config';
import { PerspectiveClientService } from '@iverify/perspective-client/src/lib/perspective-client.service';
import { Injectable, Logger } from '@nestjs/common';
import { toArray } from 'lodash';
import { isEmpty } from 'radash';
import { from, switchMap } from 'rxjs';
import { LocationsService } from '../locations/locations.service';

@Injectable()
export class PerpesctiveClientHandler {
    private logger = new Logger(PerpesctiveClientHandler.name);

    constructor(
        private perspectiveClientService: PerspectiveClientService,
        private locationsService: LocationsService
    ) {}

    private async getConfigByLocation(
        locationId: string
    ): Promise<PerspectiveConfig> {
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

        const apiBase = getParam('PERSPECTIVE_API_BASE')?.value;

        const analyzeEndpoint = '/v1alpha1/comments:analyze';
        const apiKey = getParam('PERSPECTIVE_API_KEY')?.value;

        const requestConfig: PerspectiveConfig = {
            endpoints: {
                analyze: `${apiBase}/${analyzeEndpoint}?key=${apiKey}`,
            },
            apiBase,
            apiKey,
            analyzeEndpoint,
        };

        return requestConfig;
    }

    analyze(locationId: string, messages: string, threshold: number) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.perspectiveClientService.analyze(
                    requestConfig,
                    messages,
                    threshold
                );
            })
        );
    }
}
