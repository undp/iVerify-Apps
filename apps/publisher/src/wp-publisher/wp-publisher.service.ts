import { HttpException, HttpService, Injectable, Scope } from "@nestjs/common";
import { CreateCategoryDto } from "libs/wp-client/src/lib/interfaces/create-category.dto";
import { CommentStatus, CreatePostDto, PostFormat, PostStatus } from "libs/wp-client/src/lib/interfaces/create-post.dto";
import { CreateTagDto } from "libs/wp-client/src/lib/interfaces/create-tag.dto";
import { WpClientService } from "libs/wp-client/src/lib/wp-client.service";
import { combineLatest, from, iif, Observable, of, zip } from "rxjs";
import { catchError, concatMap, filter, map, reduce, scan, shareReplay, switchMap, take, tap, withLatestFrom } from "rxjs/operators";
import { SharedService } from "../shared/shared.service";
import { WpPublisherHelper } from "./wp-publisher-helper.service";
import { EmailService } from "@iverify/email/src";

@Injectable({ scope: Scope.REQUEST })
export class WpPublisherService{
    private reportId$: Observable<string> = this.shared.reportId$;
    private report$: Observable<any> = this.shared.report$.pipe(tap(report => console.log('Report: ', JSON.stringify(report))));
    private meedanReport$: Observable<any> = this.shared.meedanReport$.pipe(tap(report => console.log('Meedan report: ', JSON.stringify(report))));

    wpPostId$: Observable<number> = this.reportId$.pipe(
      switchMap(id => this.wpClient.getPostByCheckId(id)),
      map(res => res && res.length ? res[0].id : null)
    )

    categoriesIds$: Observable<number[]> = this.report$.pipe(
      map(report => this.helper.extractFactcheckingStatus(report)),
      switchMap(category => this.categoriesIds([category])),
      catchError(err => {
        throw new HttpException(err.message, 500);
      })
    )

    tagsIds$: Observable<number[]> = this.report$.pipe(
      map(report => this.helper.extractTags(report)),
      switchMap(tags => iif(() => !!tags && !!tags.length, this.tagsIds(tags), of(null))),
      catchError(err => {
        throw new HttpException(err.message, 500);
      })
    )

    private mediaId$: Observable<number> = this.meedanReport$.pipe(
        map(report => report.image),
        switchMap(url => this.http.get(url, {responseType: 'arraybuffer'})),
        map(res => Buffer.from(res.data, 'binary')),
        switchMap(data => this.wpClient.createMedia(data)),
        map(res => res['id']),
        catchError(err => {
          return of(null)
          // throw new HttpException(err.message, 500);
        })
      )

    private author$: Observable<number> = this.wpClient.getAppUser().pipe(
      map(user => user.id),
      catchError(err => {
        throw new HttpException(err.message, 500);
      })
    );

    private visualCard$: Observable<string> = this.meedanReport$.pipe(
      map(report => report.visual_card_url),
      catchError(err => {
        return of(null)
        // throw new HttpException(err.message, 500);
      })
    )

    post$: Observable<any> = combineLatest([this.report$, this.meedanReport$, this.author$, this.mediaId$, this.tagsIds$, this.categoriesIds$, this.visualCard$]).pipe(
      map(([report, meedanReport, author, media, tags, categories, visualCard]) =>
        this.helper.buildPostFromReport(report, meedanReport, author, media, tags, categories, visualCard)
      ),
      filter(post => !!post.title?.length), // Ensure post has a title
      take(1),
      tap(postDto => console.log('sending to WP publication: ', JSON.stringify(postDto))),
      withLatestFrom(this.wpPostId$),
      map(([postDto, wpPostId]) => ({ postDto, wpPostId })),
      switchMap(data => this.wpClient.publishPost(data.postDto, data.wpPostId).pipe(
        tap(wpPost => {
          this.shared.updateWpPost(wpPost);
          console.log('wpPost-12345', wpPost);

          if (data.postDto.email_address) {
            this.emailService.submittedFactCheckContent(data.postDto.email_address, 'www.google.com').catch(err => {
              console.error('Error sending post published email:', err);
            });
          }
        }),
        catchError(err => {
          throw new HttpException(err.message, 500);
        })
      ))
    );

    constructor(
        private http: HttpService,
        private shared: SharedService,
        private wpClient: WpClientService,
        private helper: WpPublisherHelper,
        private emailService: EmailService
    ){}

      private tagsIds(tags: string[]): Observable<number[]>{
        const tagsIds$: Observable<number[]> = of(tags).pipe(
          switchMap(tags => iif(()=> !!tags.length, this.createManyTags(tags), of([]))),
        )

        // const tagsLowCase = tags.map(tag => tag.toLowerCase());
        // console.log('tags: ', tagsLowCase)
        // const wpTags$: Observable<any> = this.wpClient.listTags().pipe(
        //   take(1),
        //   shareReplay(1)
        // );
        // const existingTagsIds$: Observable<number[]> = wpTags$.pipe(
        //   map(wpTags => wpTags.filter(tag => tagsLowCase.indexOf(tag.name.toLowerCase()) > -1).map(tag => {
        //     console.log('existing tag name: ', tag.name.toLowerCase())
        //     return tag.id
        //   })),
        //   );
        // const newTags$: Observable<string[]> = wpTags$.pipe(
        //   map(wpTags => wpTags.map(tag => tag.name.toLowerCase() as string)),
        //   tap(wpTags => console.log('wpTags: ', wpTags)),
        //   map(wpTags => tags.filter(tag => wpTags.indexOf(tag.toLowerCase()) === -1)),
        //   tap(wpTags => console.log('new tags: ', wpTags)),

        // )
        // const newTagsIds$: Observable<number[]> = newTags$.pipe(
        //   switchMap(tags => iif(()=> !!tags.length, this.createManyTags(tags).pipe(map(tag => [tag.id])), of([]))),
        //   reduce((acc, val) => [...acc, ...val], [])
        // )
        // const tagsIds$: Observable<number[]> = combineLatest([existingTagsIds$, newTagsIds$]).pipe(
        //   map(([existingIds, newIds]) => [...existingIds, ...newIds]),
        //   catchError(err => {
        //     throw new HttpException(err.message, 500);
        //   })
        // )

        return tagsIds$;
      }

      private categoriesIds(categories: string[]){
        categories = categories.map(c => c.toLowerCase());
        console.log('Article Categories', categories)
        const wpCategories$: Observable<any> = this.wpClient.listCategories();
        const existingCategoriesIds$: Observable<number[]> = wpCategories$.pipe(
          map(wpCategories => wpCategories.filter(category => categories.indexOf(category.name.toLowerCase()) > -1).map(category => category.id))
          );
        // const newCategories$: Observable<string[]> = wpCategories$.pipe(
        //   map(wpCategories => wpCategories.map(category => category.name as string)),
        //   map(wpCategories => categories.filter(category => wpCategories.indexOf(category) === -1))
        // )
        // const newCategoriesIds$: Observable<number[]> = newCategories$.pipe(
        //   switchMap(categories => iif(()=> !!categories.length, this.createManyCategories(categories).pipe(map(category => [category.id])), of([]))),
        //   scan((acc, val) => [...acc, ...val], [])
        // )
        // const categoriesIds$: Observable<number[]> = combineLatest([existingCategoriesIds$, newCategoriesIds$]).pipe(
        //   map(([existingIds, newIds]) => [...existingIds, ...newIds])
        // )

        return existingCategoriesIds$;
      }

      private createManyTags(tags: string[]): Observable<any>{
        const tagsDtos: CreateTagDto[] = tags.map(tag => ({name: tag}))
        return from(tagsDtos).pipe(
          tap(tag => console.log('sending tag to creation: ', tag)),
          concatMap(tag => this.createSingleTag(tag)),
          tap(tag => console.log('Returning tag from creation: ', tag)),
          reduce((acc, item) => [...acc, item], [])
        )
      }

      private createSingleTag(tag: CreateTagDto): Observable<any>{
        return this.wpClient.createTag(tag)
      }

      private createManyCategories(categories: string[]): Observable<any>{
        const categoriesDtos: CreateCategoryDto[] = categories.map(category => ({name: category}))
        return from(categoriesDtos).pipe(
          concatMap(category => this.createSingleCategory(category))
        )
      }

      private createSingleCategory(category: CreateCategoryDto): Observable<any>{
        return this.wpClient.createCategory(category)
      }
}
