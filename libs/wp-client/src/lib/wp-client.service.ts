import { HttpException, Injectable, Logger } from '@nestjs/common';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { WpConfig } from './config';
import { CreateCategoryDto } from './interfaces/create-category.dto';
import { CreatePostDto } from './interfaces/create-post.dto';
import { CreateTagDto } from './interfaces/create-tag.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class WpClientService {
    private logger = new Logger(WpClientService.name);

    constructor(private http: HttpService) {}

    publishPost(
        config: WpConfig,
        post: CreatePostDto,
        id?: number
    ): Observable<any> {
        const endPoint = id
            ? `${config.endpoints.posts}/${id}`
            : config.endpoints.posts;
        return this.http
            .post(endPoint, post, {
                auth: config.authParams,
                headers: {
                    locationId: config.locationId,
                },
            })
            .pipe(
                map((res) => {
                    return {
                        data: res.data,
                        locationId: res.config.headers.locationId,
                    };
                }),
                catchError((err) => {
                    this.logger.error('Error publishing post', err);
                    throw new HttpException(err.message, 500);
                })
            );
    }

    getPost(config: WpConfig, postId: number) {
        return this.http
            .get(config.endpoints.posts + '/' + postId, {
                headers: {
                    locationId: config.locationId,
                },
            })
            .pipe(
                map((res) => {
                    return {
                        data: res.data,
                        locationId: res.config.headers.locationId,
                    };
                }),
                catchError((err) => {
                    this.logger.log('Error getting post', err);
                    throw new HttpException(err.message, 500);
                })
            );
    }

    getPostByTitle(config: WpConfig, title: string) {
        const params = { title };
        return this.http
            .get(config.endpoints.posts, {
                params,
                headers: {
                    locationId: config.locationId,
                },
            })
            .pipe(
                map((res) => {
                    return {
                        data: res.data,
                        locationId: res.config.headers.locationId,
                    };
                }),
                catchError((err) => {
                    this.logger.error('Error getting post', err);
                    throw new HttpException(err.message, 500);
                })
            );
    }

    getPostByCheckId(config: WpConfig, check_id: string) {
        return this.http
            .get(`${config.endpoints.posts}?check_id=${check_id}`, {
                headers: {
                    locationId: config.locationId,
                    'Accept-Encoding': 'gzip,deflate,compress',
                },
            })
            .pipe(
                map((res) => {
                    return {
                        data: res.data,
                        locationId: res.config.headers.locationId,
                    };
                }),
                catchError((err) => {
                    this.logger.error('Error getting post by check id', err);
                    throw new HttpException(err.message, 500);
                })
            );
    }

    createTag(config: WpConfig, tag: CreateTagDto): Observable<any> {
        return this.http
            .post(config.endpoints.tags, tag, {
                auth: config.authParams,
                headers: {
                    locationId: config.locationId,
                },
            })
            .pipe(
                map((res) => res.data.id),
                catchError((err) => {
                    if (
                        err.response.data &&
                        err.response.data.code &&
                        err.response.data.code === 'term_exists'
                    ) {
                        return of(err.response.data.data.term_id);
                    } else {
                        this.logger.error('Error creating tag: ', err);
                        throw new HttpException(err.message, 500);
                    }
                })
            );
    }

    listTags(config: WpConfig): Observable<any> {
        const params = {
            per_page: 100,
        };
        return this.http
            .get(config.endpoints.tags, {
                params,
                headers: {
                    locationId: config.locationId,
                },
            })
            .pipe(
                map((res) => {
                    return {
                        data: res.data,
                        locationId: res.config.headers.locationId,
                    };
                }),
                catchError((err) => {
                    this.logger.error('Error listing tags: ', err);
                    throw new HttpException(err.message, 500);
                })
            );
    }

    createCategory(
        config: WpConfig,
        category: CreateCategoryDto
    ): Observable<any> {
        return this.http
            .post(config.endpoints.categories, category, {
                auth: config.authParams,
            })
            .pipe(
                map((res) => res.data),
                catchError((err) => {
                    this.logger.error('Error creating category: ', err);
                    throw new HttpException(err.message, 500);
                })
            );
    }

    listCategories(config: WpConfig): Observable<any> {
        return this.http
            .get(config.endpoints.categories, { auth: config.authParams })
            .pipe(
                map((res) => res.data),
                catchError((err) => {
                    this.logger.error('Error listing category: ', err);
                    throw new HttpException(err.message, 500);
                })
            );
    }

    createMedia(config: WpConfig, image: any) {
        const headers = {
            'Content-Disposition': 'attachment; filename="image.jpg"',
            'Mime-Type': 'image/jpeg',
            'Content-Type': 'multipart/image',
            'Cache-Control': 'no-cache',
        };
        return this.http
            .post(config.endpoints.media, image, {
                ...{ auth: config.authParams },
                ...{ headers },
            })
            .pipe(
                map((res) => res.data),
                catchError((err) => {
                    this.logger.error('Error creating media: ', err);
                    throw new HttpException(err.message, 500);
                })
            );
    }

    editMedia(config: WpConfig, mediaId: number, media: any) {
        return this.http.put(config.endpoints.media + '/' + mediaId, media, {
            auth: config.authParams,
        });
    }

    getAppUser(config: WpConfig) {
        return this.http
            .get(config.endpoints.currentUser, { auth: config.authParams })
            .pipe(
                map((res) => res.data),
                catchError((err) => {
                    this.logger.error('Error getting current user: ', err);
                    throw new HttpException(err.message, 500);
                })
            );
    }
}
