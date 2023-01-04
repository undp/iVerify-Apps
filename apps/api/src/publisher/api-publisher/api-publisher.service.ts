import { ApiClientService } from '@iverify/api-client/src';
import { Article } from '@iverify/iverify-common';
import { Injectable, Logger } from '@nestjs/common';
import { combineLatest, from, Observable, of, Subject } from 'rxjs';
import {
    catchError,
    map,
    shareReplay,
    switchMap,
    take,
    tap,
    withLatestFrom,
} from 'rxjs/operators';
import { ArticlesService } from '../../app/articles/articles.service';
import { SharedService } from '../shared/shared.service';
import { ApiPublisherHelper } from './helper';

@Injectable()
export class ApiPublisherService {
    private logger = new Logger(ApiPublisherService.name);

    private report$: Observable<any> = this.shared.report$;
    private wpPost$: Observable<any> = this.shared.wpPost$;

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

    savePost$: Observable<any> = this.article$.pipe(
        switchMap((article: any) =>
            from(this.articlesService.saveOne({ ...article }))
        ),
        catchError((err) => {
            this.logger.error(`Problems saving article ${JSON.stringify(err)}`);
            return of(null);
        })
    );

    constructor(
        private shared: SharedService,
        private apiClient: ApiClientService,
        private helper: ApiPublisherHelper,
        private readonly articlesService: ArticlesService
    ) {}
}
