import { ApiClientConfig, ApiClientService } from '@iverify/api-client/src';
import { Article } from '@iverify/iverify-common/src';
import { Injectable, Logger } from '@nestjs/common';
import { toArray } from 'lodash';
import { isEmpty } from 'radash';
import { from, switchMap } from 'rxjs';
import { LocationsService } from './locations/locations.service';

@Injectable()
export class ApiClientHandler {
    private logger = new Logger(ApiClientHandler.name);

    constructor(
        private locationsService: LocationsService,
        private apiClientService: ApiClientService
    ) {}

    private async getConfigByLocation(
        locationId: string
    ): Promise<ApiClientConfig> {
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

        const apiUrl = getParam('API_URL')?.value;

        const requestConfig: ApiClientConfig = {
            apiUrl,
            postArticleUrl: `${apiUrl}/articles/save-article`,
            postToxicStatsUrl: `${apiUrl}/stats/toxicity`,
        };

        return requestConfig;
    }

    postArticle(locationId: string, article: Partial<Article>) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.apiClientService.postArticle(
                    requestConfig,
                    article
                );
            })
        );
    }

    postToxicStats(locationId: string, toxicCount: number) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.apiClientService.postToxicStats(
                    requestConfig,
                    toxicCount
                );
            })
        );
    }
}
