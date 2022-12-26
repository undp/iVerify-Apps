import {
    WpConfig,
    WpConfigAuthParams,
    WpConfigEndpoints,
} from '@iverify/wp-client/src/lib/config';
import { CreateCategoryDto } from '@iverify/wp-client/src/lib/interfaces/create-category.dto';
import { CreatePostDto } from '@iverify/wp-client/src/lib/interfaces/create-post.dto';
import { CreateTagDto } from '@iverify/wp-client/src/lib/interfaces/create-tag.dto';
import { WpClientService } from '@iverify/wp-client/src/lib/wp-client.service';
import { Injectable, Logger } from '@nestjs/common';
import { toArray } from 'lodash';
import { isEmpty } from 'radash';
import { from, switchMap } from 'rxjs';
import { LocationsService } from '../locations/locations.service';

@Injectable()
export class WpClientHandler {
    private logger = new Logger(WpClientHandler.name);

    constructor(
        private locationsService: LocationsService,
        private wpClientService: WpClientService
    ) {}

    private async getConfigByLocation(locationId: string): Promise<WpConfig> {
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

        const wpUrl = getParam('WP_URL')?.value;
        const apiBase = `${wpUrl}//wp-json/wp/v2`;

        const endpoints: WpConfigEndpoints = {
            posts: `${apiBase}/posts`,
            tags: `${apiBase}/tags`,
            categories: `${apiBase}/categories`,
            media: `${apiBase}/media`,
            currentUser: `${apiBase}/users/me`,
        };

        const authParams: WpConfigAuthParams = {
            username: getParam('WP_USERNAME')?.value,
            password: getParam('WP_PASSWORD')?.value,
        };

        const requestConfig: WpConfig = {
            WP_URL: wpUrl,
            apiBase,
            endpoints,
            authParams,
        };

        return requestConfig;
    }

    publishPost(locationId: string, post: CreatePostDto, id?: number) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.wpClientService.publishPost(
                    requestConfig,
                    post,
                    id
                );
            })
        );
    }

    getPost(locationId: string, postId?: number) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.wpClientService.getPost(requestConfig, postId);
            })
        );
    }

    getPostByTitle(locationId: string, title: string) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.wpClientService.getPostByTitle(
                    requestConfig,
                    title
                );
            })
        );
    }

    getPostByCheckId(locationId: string, check_id: string) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.wpClientService.getPostByCheckId(
                    requestConfig,
                    check_id
                );
            })
        );
    }

    createTag(locationId: string, tag: CreateTagDto) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.wpClientService.createTag(requestConfig, tag);
            })
        );
    }

    listTags(locationId: string) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.wpClientService.listTags(requestConfig);
            })
        );
    }

    createCategory(locationId: string, category: CreateCategoryDto) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.wpClientService.createCategory(
                    requestConfig,
                    category
                );
            })
        );
    }

    listCategories(locationId: string) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.wpClientService.listCategories(requestConfig);
            })
        );
    }

    createMedia(locationId: string, image: any) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.wpClientService.createMedia(requestConfig, image);
            })
        );
    }

    editMedia(locationId: string, mediaId: number, media: any) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.wpClientService.editMedia(
                    requestConfig,
                    mediaId,
                    media
                );
            })
        );
    }

    getAppUser(locationId: string) {
        return from(this.getConfigByLocation(locationId)).pipe(
            switchMap((requestConfig) => {
                return this.wpClientService.getAppUser(requestConfig);
            })
        );
    }
}
