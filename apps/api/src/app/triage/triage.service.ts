import { HttpException, Injectable, Logger } from '@nestjs/common';
import { CrowdtangleClientService } from '@iverify/crowdtangle-client/src/lib/crowdtangle-client.service';
import {
    MeedanCheckClientService,
    ToxicityScores,
} from '@iverify/meedan-check-client';
import { MlServiceClientService } from '@iverify/ml-service-client/src/lib/ml-service-client.service';
// import { TriageConfig } from './config';
import { PerspectiveClientService } from '@iverify/perspective-client/src/lib/perspective-client.service';
import { MlServiceType } from '@iverify/iverify-common';
// import { TranslateService } from './TranslateService/TranslateService';
import { lastValueFrom } from 'rxjs';
import { TriageConfig } from './config';
import { CheckClientHandlerService } from '../checkStatsClientHandler.service';
import * as pMap from 'p-map';

@Injectable()
export class TriageService {
    private readonly logger = new Logger('TriageAppService');

    constructor(
        private ctClient: CrowdtangleClientService,
        private mlClient: MlServiceClientService,
        private perspectiveClient: PerspectiveClientService,
        private config: TriageConfig, // private translate: TranslateService
        private checkClient: CheckClientHandlerService
    ) {}

    async analyze(
        locationId: string,
        startDate: string,
        endDate: string
    ): Promise<number> {
        try {
            const lists: any = await lastValueFrom(this.ctClient.getLists());

            const savedSearches = lists.filter(
                (list) => list.type === 'SAVED_SEARCH'
            );
            const listsIds = savedSearches.map((list) => list.id);
            let toxicPosts = [];

            await pMap(
                listsIds,
                async (listId) => {
                    const pagination = { count: 100, offset: 0, iterations: 0 };
                    const toxicPostsByList = await this.getToxicPostsByList(
                        locationId,
                        listId.toString(),
                        pagination,
                        startDate,
                        endDate,
                        []
                    );
                    toxicPosts = [...toxicPosts, ...toxicPostsByList];
                },
                {
                    concurrency: 2,
                    stopOnError: false,
                }
            );

            if (!toxicPosts.length) {
                this.logger.log('No toxic posts found.');
                return 0;
            }

            let createdItems = [];
            const uniqueToxicPosts = [...new Set(toxicPosts)];
            this.logger.log(
                `${uniqueToxicPosts.length} toxic posts found. Creating Meedan Check items...`
            );

            await pMap(
                uniqueToxicPosts,
                async (post) => {
                    this.logger.log('Creating item...');
                    const item: any = await lastValueFrom(
                        this.checkClient.createItem(
                            locationId,
                            post.postUrl,
                            post.toxicScores
                        )
                    );

                    console.log('item: ', item);
                    if (!item.error) {
                        createdItems = [...createdItems, item];
                    }
                },
                { concurrency: 2 }
            );

            this.logger.log(`Created ${createdItems.length} items.`);
            return createdItems.length;
        } catch (e) {
            this.logger.error('Analyze error: ', e.message);
            throw new HttpException(e.message, 500);
        }
    }

    private async getToxicPostsByList(
        locationId: string,
        listId: string,
        pagination: any,
        startDate: string,
        endDate: string,
        posts: any[]
    ) {
        try {
            this.logger.log(`Fething posts with params: 
        listId - ${listId}, 
        count - ${pagination.count}, 
        offset - ${pagination.offset}, 
        startDate - ${startDate},
        endDate - ${endDate}`);
            this.logger.log(
                `Max post scan limit - ${this.config.postScanLimit}`
            );
            const res: any = await lastValueFrom(
                this.ctClient.getPosts(
                    listId,
                    pagination.count,
                    pagination.offset,
                    startDate,
                    endDate
                )
            );

            this.logger.log(`Received ${res.posts.length} posts. Analyzing...`);
            let postsCount = 0;

            await pMap(
                res['posts'],
                async (post: any) => {
                    const postMessage = post.message ? post.message : '';
                    const postDescription = post.description
                        ? post.description
                        : '';
                    const text = `${postMessage}. ${postDescription}`;
                    this.logger.log(`Sending post for analysis...`);
                    const toxicScores: any = await this.mlAnalyze(text);

                    this.logger.log(`Received toxic score: ${toxicScores}`);
                    const isToxic =
                        toxicScores && toxicScores.toxicity
                            ? this.isToxic(
                                  toxicScores,
                                  post.postUrl,
                                  text.length
                              )
                            : false;
                    if (isToxic) posts.push({ ...post, toxicScores });
                    postsCount++;
                },
                {
                    concurrency: 2,
                    stopOnError: false,
                }
            );

            const totalPostsAnalyzed =
                pagination.iterations * pagination.count + postsCount;
            this.logger.log(
                `Analyzed ${totalPostsAnalyzed} posts, toxic so far: ${posts.length}`
            );
            if (res['pagination'] && res.pagination['nextPage']) {
                const iterations = pagination.iterations + 1;
                const offset = pagination.count * iterations;
                if (offset < this.config.postScanLimit) {
                    return await this.getToxicPostsByList(
                        locationId,
                        listId,
                        { ...pagination, offset, iterations },
                        startDate,
                        endDate,
                        posts
                    );
                } else {
                    this.logger.log(
                        `Max post scan limit reached ${this.config.postScanLimit} - skipping other posts`
                    );
                    return posts;
                }
            } else {
                this.logger.log(`No more pages.`);
                return posts;
            }
        } catch (e) {
            this.logger.error(
                'Error fetching and analyzing posts: ',
                e.message
            );
            throw new HttpException(e.message, 500);
        }
    }

    private isToxic(
        toxicScores: ToxicityScores,
        postUrl: string,
        textLength: number
    ): boolean {
        if (!toxicScores) {
            this.logger.warn(
                `Invalid toxicScores for post ${postUrl} with text length ${textLength}, toxicScores: ${toxicScores}. Flagging post as non-toxic.`
            );
            return false;
        }
        return Object.keys(toxicScores).reduce((acc, val) => {
            if (toxicScores[val] > this.config.toxicTreshold) acc = true;
            return acc;
        }, false);
    }

    async createItemFromWp(url: string, content: string) {
        const lang =
            process.env && process.env.language ? process.env.language : 'en';
        // let wp_key = this.translate.get('message_from_website', lang);
        let wp_key = '';
        if (!wp_key) wp_key = 'message_from_website';
        return await this.checkClient.createItemFromWp(
            url.trim(),
            content,
            wp_key
        );
    }

    private async mlAnalyze(text: string) {
        switch (this.config.mlServiceType) {
            case MlServiceType.UNICC_DETOXIFY_1:
                return await lastValueFrom(this.mlClient.analyze([text]));
            case MlServiceType.PERSPECTIVE:
                return await lastValueFrom(
                    this.perspectiveClient.analyze(
                        text,
                        this.config.toxicTreshold
                    )
                );
        }
    }
}
