import { HttpException, Injectable, Logger } from '@nestjs/common';
import { CrowdtangleClientConfig } from './config';
import {
    catchError,
    delay,
    map,
    retry,
    retryWhen,
    take,
    tap,
} from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CrowdtangleClientService {
    private readonly logger = new Logger(CrowdtangleClientService.name);

    constructor(private http: HttpService) {}

    getLists(config: CrowdtangleClientConfig) {
        const params = { token: config.apiKey };
        return this.http.get(`${config.endpoints.lists}`, { params }).pipe(
            map((res: any) => res.data.result.lists),
            retry(3),
            catchError((err) => {
                this.logger.error(
                    `Error fetching CrowdTangle lists: `,
                    err.message
                );
                throw new HttpException(err.message, 500);
            })
        );
    }

    getPosts(
        config: CrowdtangleClientConfig,
        listIds: string,
        count: number,
        offset: number,
        startDate: string,
        endDate: string
    ) {
        const params = {
            token: config.apiKey,
            count,
            offset,
            startDate,
            sortBy: 'date',
            endDate,
            listIds,
        };
        return this.http.get(`${config.endpoints.posts}`, { params }).pipe(
            retryWhen((errors) =>
                errors.pipe(
                    tap((e) => console.log('error..', e.message)),
                    delay(90000),
                    take(10)
                )
            ),
            map((res) => res.data.result),
            // retry(3),
            catchError((err) => {
                this.logger.error(`Error fetching posts: `, err.message);
                throw new HttpException(err.message, 500);
            })
        );
    }
}
