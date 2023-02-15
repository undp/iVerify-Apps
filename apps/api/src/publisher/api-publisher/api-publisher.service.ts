/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ApiClientService } from '@iverify/api-client/src';
import { Article } from '@iverify/iverify-common';
import { Injectable, Logger, Scope } from '@nestjs/common';
import { combineLatest, forkJoin, from, Observable, of, Subject } from 'rxjs';
import {
    catchError,
    combineLatestAll,
    map,
    shareReplay,
    switchMap,
    take,
    tap,
    withLatestFrom,
} from 'rxjs/operators';
import { ArticlesService } from '../../app/articles/articles.service';
import { LocationsService } from '../../app/locations/locations.service';
import { SharedService } from '../shared/shared.service';
import { ApiPublisherHelper } from './helper';

@Injectable({ scope: Scope.REQUEST })
export class ApiPublisherService {
    private logger = new Logger(ApiPublisherService.name);

    private report$: Observable<any> = this.shared.report$;
    private wpPost$: Observable<any> = this.shared.wpPost$;

    meedanId$: Observable<number> = this.report$.pipe(
        map((report) => {
            this.logger.debug(`Meedan report ${JSON.stringify(report)}`);
            return report.dbid;
        })
    );

    wpId$: Observable<number> = this.wpPost$.pipe(map((wpPost) => wpPost.id));

    article$: Observable<Partial<Article>> = combineLatest([
        this.report$,
        this.wpPost$,
    ]).pipe(
        tap(() => this.logger.log('generating article...')),
        // switchMap(([report, wpPost]) => combineLatest(
        //     report,
        //     wpPost,
        //     LocationsService.getLocationLanguage(report.locationId)
        // )),
        //@ts-ignore
        // map(([{report}, wpPost, lang]) => this.helper.buildArticle(report.report, wpPost, lang)),
        map(([{ report }, wpPost]) =>
            this.helper.buildArticle(report, wpPost, 'es')
        ),
        catchError((err) => {
            this.logger.error(
                'Problems converting report and post to article....',
                err.message
            );
            return of(null);
        })
    );

    savePost$: Observable<any> = this.article$.pipe(
        switchMap((article: any) => {
            this.logger.debug(`savePost ${JSON.stringify(article)}`);
            this.logger.debug(`wpUrl ${article.wpUrl}`);
            return from(this.articlesService.saveOne({ ...article }));
        }),
        catchError((err) => {
            this.logger.error(`Problems saving article ${JSON.stringify(err)}`);
            return of(null);
        })
    );

    constructor(
        private shared: SharedService,
        private apiClient: ApiClientService,
        private helper: ApiPublisherHelper,
        private readonly articlesService: ArticlesService,
        locationsService: LocationsService
    ) {}
}
