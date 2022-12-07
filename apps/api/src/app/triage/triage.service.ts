import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';

import { ToxicityScores } from '@iverify/meedan-check-client';

// import { TriageConfig } from './config';import { PerspectiveClientService } from '@iverify/perspective-client/src/lib/perspective-client.service';
import { MlServiceType } from '@iverify/iverify-common';
// import { TranslateService } from './TranslateService/TranslateService';
import { lastValueFrom } from 'rxjs';

import { CheckClientHandlerService } from '../handlers/checkStatsClientHandler.service';
import * as pMap from 'p-map';
import { LessThanOrEqual, Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { TriagePostControl } from './models/triage.post.control.model';
import { LocationsService } from '../locations/locations.service';

import { TriageControlStatuses } from './enum/triage.control.statuses.enum';
import { isEmpty } from 'radash';

import { DateTime } from 'luxon';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MLServiceClientHandler } from '../handlers/mlServiceClientHandler.service';
import { CrowdtangleClientHandler } from '../handlers/CrowdtangleClientHandler.service';
import { PerpesctiveClientHandler } from '../handlers/perspectiveClientHandler.service';
import { TriageConfig } from './config';

@Injectable()
export class TriageService {
    private readonly logger = new Logger('TriageAppService');

    constructor(
        private mlClient: MLServiceClientHandler,
        private perspectiveClient: PerpesctiveClientHandler,
        private checkClient: CheckClientHandlerService,

        @InjectRepository(TriagePostControl)
        private triagePostControlRepository: Repository<TriagePostControl>,

        @Inject(LocationsService)
        private locationsService: LocationsService,

        @Inject(CrowdtangleClientHandler)
        private ctClient: CrowdtangleClientHandler
    ) {}

    private async getConfigByLocation(
        locationId: string
    ): Promise<TriageConfig> {
        const { params } = await this.locationsService.findById(locationId);

        const getParam: any = (param) =>
            params.find(({ key }) => key === param);

        const mlServiceType = getParam('ML_SERVICE_TYPE')?.value;

        const toxicTreshold = Number(getParam('DETOXIFY_TRESHOLD')?.value ?? 0);
        const postScanLimit = Number(getParam('MAX_POST_SCAN')?.value ?? 2500);

        return {
            mlServiceType,
            toxicTreshold,
            postScanLimit,
        };
    }

    /**
     * @description it will request the posts and save it to be processed
     */
    private async getPosts(
        locationId: string,
        listId: string,
        startDate: string,
        endDate: string
    ): Promise<any> {
        try {
            const pagination = { count: 100, offset: 0, iterations: 0 };

            const toxicPostsByList = await this.getToxicPostsByList(
                locationId,
                listId.toString(),
                pagination,
                startDate,
                endDate,
                []
            );

            await pMap(
                toxicPostsByList,
                async (post) => {
                    return this.triagePostControlRepository.save({
                        status: TriageControlStatuses.IDLE,
                        post,
                        locationId: locationId,
                    });
                },
                { concurrency: 4, stopOnError: false }
            );
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }

    public async prepareListAndPosts(
        locationId: string,
        startDate: string,
        endDate: string
    ): Promise<void> {
        try {
            const lists: any = await lastValueFrom(
                this.ctClient.getLists(locationId)
            );

            const savedSearches = lists.filter(
                (list) => list.type === 'SAVED_SEARCH'
            );

            const listsIds = savedSearches.map((list) => list.id);

            await pMap(
                listsIds,
                async (listId) => {
                    return this.getPosts(
                        locationId,
                        listId.toString(),
                        startDate,
                        endDate
                    );
                },
                {
                    concurrency: 2,
                    stopOnError: false,
                }
            );
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }

    private createItem(locationId: string, post: any): Promise<any> {
        return lastValueFrom(
            this.checkClient.createItem(
                locationId,
                post.postUrl,
                post.toxicScores
            )
        );
    }

    /**
     * @escription Based on the interval defined, the cron will get all on_going process and mark it as failed on those who took more than 15 minutes to be completed.
     *  It maybe failed in the middle with an unhandled exception
     */
    @Cron(CronExpression.EVERY_5_MINUTES)
    async expireLockedPosts(): Promise<void> {
        const onGoingPosts = await this.triagePostControlRepository.find({
            where: {
                status: TriageControlStatuses.ON_GOING,
            },
        });

        await pMap(
            onGoingPosts,
            async (postRecord) => {
                const now = DateTime.now();
                const createdAt = DateTime.fromISO(
                    postRecord.updatedAt.toISOString()
                );

                const diffMinutes = now.diff(createdAt, 'minutes');

                if (diffMinutes.minutes > 15) {
                    await this.triagePostControlRepository.update(
                        postRecord.id,
                        {
                            status: TriageControlStatuses.FAILED,
                            failedCount: postRecord.failedCount++,
                        }
                    );
                }
            },
            { concurrency: 10, stopOnError: false }
        );
    }

    // delete items cron

    async analyze(locationId: string): Promise<number> {
        try {
            const posts = await this.triagePostControlRepository.find({
                where: [
                    {
                        status: TriageControlStatuses.IDLE,
                    },
                    {
                        status: TriageControlStatuses.FAILED,
                        failedCount: LessThanOrEqual(3),
                    },
                ],
            });

            await pMap(posts, (postRecord) =>
                this.triagePostControlRepository.update(postRecord.id, {
                    status: TriageControlStatuses.ON_GOING,
                })
            );

            if (isEmpty(posts)) {
                this.logger.log('No toxic posts found.');
                return 0;
            }

            this.logger.log(
                `${posts.length} toxic posts found. Creating Meedan Check items...`
            );

            const createdItems = await pMap(
                posts,
                async (postRecord) => {
                    try {
                        this.logger.log('Creating item...');
                        const item: any = await this.createItem(
                            locationId,
                            postRecord.post
                        );

                        console.log('item: ', item);
                        if (item.error) {
                            throw new Error(item.error);
                        }

                        postRecord.status = TriageControlStatuses.SUCCESS;

                        return item;
                    } catch (err) {
                        this.logger.error(
                            `Failed to create item for the record ${postRecord.id}`
                        );
                        postRecord.failResult = err;
                        postRecord.failedCount++;
                        postRecord.status = TriageControlStatuses.FAILED;
                    } finally {
                        await this.triagePostControlRepository.update(
                            postRecord.id,
                            { ...postRecord }
                        );
                    }
                },
                { concurrency: 2, stopOnError: false }
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
            const config = await this.getConfigByLocation(locationId);

            this.logger.log(`Fething posts with params: 
        listId - ${listId}, 
        count - ${pagination.count}, 
        offset - ${pagination.offset}, 
        startDate - ${startDate},
        endDate - ${endDate}`);
            this.logger.log(`Max post scan limit - ${config.postScanLimit}`);
            const res: any = await lastValueFrom(
                this.ctClient.getPosts(
                    locationId,
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
                    const toxicScores: any = await this.mlAnalyze(
                        locationId,
                        text
                    );

                    this.logger.log(`Received toxic score: ${toxicScores}`);

                    let isToxic = false;

                    if (toxicScores && toxicScores.toxicity) {
                        isToxic = await this.isToxic(
                            locationId,
                            toxicScores,
                            post.postUrl,
                            text.length
                        );
                    }

                    if (isToxic) posts.push({ ...post, toxicScores });
                    postsCount++;
                },
                {
                    concurrency: 1,
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
                if (offset < config.postScanLimit) {
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
                        `Max post scan limit reached ${config.postScanLimit} - skipping other posts`
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

    private async isToxic(
        locationId: string,
        toxicScores: ToxicityScores,
        postUrl: string,
        textLength: number
    ): Promise<boolean> {
        const config = await this.getConfigByLocation(locationId);

        if (!toxicScores) {
            this.logger.warn(
                `Invalid toxicScores for post ${postUrl} with text length ${textLength}, toxicScores: ${toxicScores}. Flagging post as non-toxic.`
            );
            return false;
        }
        return Object.keys(toxicScores).reduce((acc, val) => {
            if (toxicScores[val] > config.toxicTreshold) acc = true;
            return acc;
        }, false);
    }

    async createItemFromWp(locationId: string, url: string, content: string) {
        let wp_key = '';
        if (!wp_key) wp_key = 'message_from_website';
        return await this.checkClient.createItemFromWp(
            locationId,
            url.trim(),
            content,
            wp_key
        );
    }

    private async mlAnalyze(locationId: string, text: string) {
        const config = await this.getConfigByLocation(locationId);

        switch (config.mlServiceType) {
            case MlServiceType.UNICC_DETOXIFY_1:
                return await lastValueFrom(
                    this.mlClient.analyze(locationId, [text])
                );
            case MlServiceType.PERSPECTIVE:
                return await lastValueFrom(
                    this.perspectiveClient.analyze(
                        locationId,
                        text,
                        config.toxicTreshold
                    )
                );
        }
    }
}
