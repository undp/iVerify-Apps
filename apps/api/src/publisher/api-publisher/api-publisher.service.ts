import { ApiClientService } from '@iverify/api-client/src';
import { Article } from '@iverify/iverify-common';
import { Injectable, Logger } from '@nestjs/common';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import {
    catchError,
    map,
    shareReplay,
    switchMap,
    take,
    tap,
    withLatestFrom,
} from 'rxjs/operators';
import { SharedService } from '../shared/shared.service';
import { ApiPublisherHelper } from './helper';

@Injectable()
export class ApiPublisherService {
    private logger = new Logger(ApiPublisherService.name);

    private report$: Observable<any> = this.shared.report$;
    private wpPost$: Observable<any> = this.shared.wpPost$;
    private locationId$: Observable<any> = this.shared.locationId$;

    meedanId$: Observable<number> = this.report$.pipe(
        map((report) => report.dbid)
    );

    wpId$: Observable<number> = this.wpPost$.pipe(map((wpPost) => wpPost.id));

    article$: Observable<Partial<Article>> = combineLatest([
        this.report$,
        this.wpPost$,
    ]).pipe(
        tap(() => this.logger.log('generating article...')),
        map(([report, wpPost]) => this.helper.buildArticle(report, wpPost)),
        catchError((err) => {
            this.logger.error(
                'Problems converting report and post to article....',
                err.message
            );
            return of(null);
        })
    );

    postToApi$: Observable<any> = this.article$.pipe(
        tap((article) =>
            this.logger.log('posting article...', JSON.stringify(article))
        ),
        withLatestFrom(this.locationId$),
        map(([article, locationId]) => ({ article, locationId })),
        switchMap((data: any) =>
            this.apiClient.postArticle(data.locationId, data.article)
        ),
        map((res) => res.data),
        catchError((err) => {
            this.logger.error(
                'Problems posting article to api....',
                err.message
            );
            return of(null);
        })
    );

    constructor(
        private shared: SharedService,
        private apiClient: ApiClientService,
        private helper: ApiPublisherHelper
    ) {}
}
