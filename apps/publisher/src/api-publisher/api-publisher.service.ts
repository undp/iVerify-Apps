import { ApiClientService } from "@iverify/api-client/src";
import { Article } from "@iverify/iverify-common";
import { Injectable, Scope } from "@nestjs/common";
import { combineLatest, Observable, of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { SharedService } from "../shared/shared.service";
import { ApiPublisherHelper } from "./helper";

@Injectable({ scope: Scope.REQUEST })
export class ApiPublisherService {
    private report$: Observable<any> = this.shared.report$;
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
    ) { }
}
