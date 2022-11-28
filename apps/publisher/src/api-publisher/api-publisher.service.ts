import { ApiClientService } from "@iverify/api-client/src";
import { Article } from "@iverify/iverify-common";
import { HttpException, HttpService, Injectable, Scope } from "@nestjs/common";
import { CreateCategoryDto } from "libs/wp-client/src/lib/interfaces/create-category.dto";
import { CommentStatus, CreatePostDto, PostFormat, PostStatus } from "libs/wp-client/src/lib/interfaces/create-post.dto";
import { CreateTagDto } from "libs/wp-client/src/lib/interfaces/create-tag.dto";
import { report } from "node:process";
import { combineLatest, from, iif, Observable, of, zip } from "rxjs";
import { catchError, concatMap, filter, map, reduce, scan, shareReplay, switchMap, take, tap } from "rxjs/operators";
import { SharedService } from "../shared/shared.service";
import { ApiPublisherHelper } from "./helper";

@Injectable({ scope: Scope.REQUEST })
export class ApiPublisherService{
    private report$: Observable<any> = this.shared.report$;
    private meedanReport$: Observable<any> = this.shared.meedanReport$;
    private wpPost$: Observable<any> = this.shared.wpPost$;

    meedanId$: Observable<number> = this.report$.pipe(map(report => report.dbid));
    wpId$: Observable<number> = this.wpPost$.pipe(map(wpPost => wpPost.id));

    article$: Observable<Partial<Article>> = combineLatest([this.report$, this.wpPost$]).pipe(
        tap(() => console.log('generating article...')),
        map(([report, wpPost]) => this.helper.buildArticle(report, wpPost)),
        catchError(err => {
            console.log('Problems converting report and post to article....', err.message)
            return of(null);
          })
    )

    postToApi$: Observable<any> = this.article$.pipe(
        tap(article => console.log('posting article...', article)),
        switchMap(article => this.apiClient.postArticle(article)),
        map(res => res.data),
        catchError(err => {
            console.log('Problems posting article to api....', err.message)
            return of(null);
          })
    )

    constructor(
        private shared: SharedService,
        private apiClient: ApiClientService,
        private helper: ApiPublisherHelper
    ){}
}
