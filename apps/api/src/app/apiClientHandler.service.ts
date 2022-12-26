import { ApiClientConfig, ApiClientService } from '@iverify/api-client/src';
import { Article } from '@iverify/iverify-common/src';
import { Injectable } from '@nestjs/common';
import { from, switchMap } from 'rxjs';
import { LocationsService } from './locations/locations.service';

@Injectable()
export class ApiClientHandler {
    constructor(
        private locationsService: LocationsService,
        private apiClientService: ApiClientService
    ) {}

    private async getConfigByLocation(
        locationId: string
    ): Promise<ApiClientConfig> {
        const { params } = await this.locationsService.findById(locationId);

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
