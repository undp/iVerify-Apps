import { CrowdtangleClientConfig } from '@iverify/crowdtangle-client/src/lib/config';
import { CrowdtangleClientService } from '@iverify/crowdtangle-client/src/lib/crowdtangle-client.service';
import { Injectable, Logger } from '@nestjs/common';
import { toArray } from 'lodash';
import { isEmpty } from 'radash';
import { from, switchMap } from 'rxjs';
import { LocationsService } from '../locations/locations.service';

@Injectable()
export class CrowdtangleClientHandler {
    private logger = new Logger(CrowdtangleClientHandler.name);

    constructor(
        private crowdtangleClientService: CrowdtangleClientService,
        private locationsService: LocationsService
    ) {}

    private async getConfigByLocation(
        locationId: string
    ): Promise<CrowdtangleClientConfig> {
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

        const apiBase = getParam('CT_API_URL')?.value;

        const requestConfig: CrowdtangleClientConfig = {
            endpoints: {
                posts: `${apiBase}/posts`,
                lists: `${apiBase}/lists`,
            },
            apiBase,
            apiKey: getParam('CT_API_KEY')?.value,
        };

        return requestConfig;
    }

    getLists(locationId: string) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.crowdtangleClientService.getLists(requestConfig);
            })
        );
    }

    getPosts(
        locationId: string,
        listIds: string,
        count: number,
        offset: number,
        startDate: string,
        endDate: string
    ) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.crowdtangleClientService.getPosts(
                    requestConfig,
                    listIds,
                    count,
                    offset,
                    startDate,
                    endDate
                );
            })
        );
    }
}
