import { HttpException, HttpService, Injectable, Scope } from "@nestjs/common";
import { CreateCategoryDto } from "libs/wp-client/src/lib/interfaces/create-category.dto";
import { CommentStatus, CreatePostDto, PostFormat, PostStatus } from "libs/wp-client/src/lib/interfaces/create-post.dto";
import { CreateTagDto } from "libs/wp-client/src/lib/interfaces/create-tag.dto";
import { WpClientService } from "libs/wp-client/src/lib/wp-client.service";
import { combineLatest, from, iif, Observable, of, zip } from "rxjs";
import { catchError, concatMap, filter, map, reduce, scan, switchMap, tap } from "rxjs/operators";
import { SharedService } from "../shared/shared.service";
import { WpPublisherHelper } from "./wp-publisher-helper.service";

@Injectable({ scope: Scope.REQUEST })
export class WpPublisherService{
    private report$: Observable<any> = this.shared.report$;

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
    
    private mediaId$: Observable<number> = this.report$.pipe(
        map(report => this.helper.extractMedia(report)),
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
    
    post$: Observable<any> = zip([this.report$, this.author$, this.mediaId$, this.tagsIds$, this.categoriesIds$]).pipe(
        map(([report, author, media, tags, categories]) => this.helper.buildPostFromReport(report, author, media, tags, categories)),
        filter(post => !!post.title.length),
        tap(() => console.log('emitting to publish...')),
        switchMap(postDto => this.wpClient.publishPost(postDto)),
        catchError(err => {
          throw new HttpException(err.message, 500);
        })
      ) 

    constructor(
        private http: HttpService,
        private shared: SharedService,
        private wpClient: WpClientService,
        private helper: WpPublisherHelper
    ){}

      private tagsIds(tags: string[]): Observable<number[]>{
        const wpTags$: Observable<any> = this.wpClient.listTags();
        const existingTagsIds$: Observable<number[]> = wpTags$.pipe(
          map(wpTags => wpTags.filter(tag => tags.indexOf(tag.name) > -1).map(tag => tag.id))
          );
        const newTags$: Observable<string[]> = wpTags$.pipe(
          map(wpTags => wpTags.map(tag => tag.name as string)),
          map(wpTags => tags.filter(tag => wpTags.indexOf(tag) === -1))
        ) 
        const newTagsIds$: Observable<number[]> = newTags$.pipe(
          switchMap(tags => iif(()=> !!tags.length, this.createManyTags(tags).pipe(map(tag => [tag.id])), of([]))),
          reduce((acc, val) => [...acc, ...val], [])
        )
        const tagsIds$: Observable<number[]> = combineLatest([existingTagsIds$, newTagsIds$]).pipe(
          map(([existingIds, newIds]) => [...existingIds, ...newIds]),
          catchError(err => {
            throw new HttpException(err.message, 500);
          })
        )
    
        return tagsIds$;
      }

      private categoriesIds(categories: string[]){
        categories = categories.map(c => c.toLowerCase());
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
          concatMap(tag => this.createSingleTag(tag))
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
