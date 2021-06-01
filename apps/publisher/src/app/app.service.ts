import { Injectable } from '@nestjs/common';
import { MeedanCheckClientService } from 'libs/meedan-check-client/src/lib/meedan-check-client.service';
import { CreateCategoryDto } from 'libs/wp-client/src/lib/interfaces/create-category.dto';
import { CommentStatus, CreatePostDto, PostFormat, PostStatus } from 'libs/wp-client/src/lib/interfaces/create-post.dto';
import { CreateTagDto } from 'libs/wp-client/src/lib/interfaces/create-tag.dto';
import { WpClientService } from 'libs/wp-client/src/lib/wp-client.service';
import { combineLatest, from, iif, Observable, of } from 'rxjs';
import { catchError, concatMap, map, scan, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class AppService {
  constructor(
    private checkClient: MeedanCheckClientService, 
    private wpClient: WpClientService
    ){}
  
  publishReportById(id: string): Observable<any>{
    const report$: Observable<any> = this.checkClient.getReport(id);
    // const tagsIds$: Observable<number[]> = report$.pipe(
    //   map(report => report.tags),
    //   switchMap(tags => iif(() => !!tags && tags.length, this.tagsIds(tags), of(null)))
    // )
    // const categoriesIds$: Observable<number[]> = report$.pipe(
    //   map(report => report.categories),
    //   switchMap(categories => iif(() => !!categories && categories.length, this.categoriesIds(categories), of(null)))
    // )
    const author$: Observable<number> = this.wpClient.getAppUser();
    const post$: Observable<any> = combineLatest([report$, author$]).pipe(
      map(([report, author]) => this.buildPostFromReport(report, author)),
      switchMap(postDto => this.wpClient.publishPost(postDto))
    )


    return post$

  }

  private buildPostFromReport(
    report: any, 
    // tags: number[], 
    // categories: number[], 
    author: number): CreatePostDto{
    const status = PostStatus.publish;
    const comment_status = CommentStatus.open;
    const format = PostFormat.standard;
    const title = report.title;
    const content = report.description;
    const meta = {
      check_report_id: report.annotation.id
    }

    const post: CreatePostDto = {
      format,
      author,
      title,
      content,
      meta,
      comment_status,
      status,
      // categories,
      // tags
    }

    console.log('post: ', post)

    return post;
  }

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
      scan((acc, val) => [...acc, ...val], [])
    )
    const tagsIds$: Observable<number[]> = combineLatest([existingTagsIds$, newTagsIds$]).pipe(
      map(([existingIds, newIds]) => [...existingIds, ...newIds])
    )

    return tagsIds$;
  }

  private categoriesIds(categories: string[]){
    const wpCategories$: Observable<any> = this.wpClient.listCategories();
    const existingCategoriesIds$: Observable<number[]> = wpCategories$.pipe(
      map(wpCategories => wpCategories.filter(category => categories.indexOf(category.name) > -1).map(category => category.id))
      );
    const newCategories$: Observable<string[]> = wpCategories$.pipe(
      map(wpCategories => wpCategories.map(category => category.name as string)),
      map(wpCategories => categories.filter(category => wpCategories.indexOf(category) === -1))
    ) 
    const newCategoriesIds$: Observable<number[]> = newCategories$.pipe(
      switchMap(categories => iif(()=> !!categories.length, this.createManyCategories(categories).pipe(map(category => [category.id])), of([]))),
      scan((acc, val) => [...acc, ...val], [])
    )
    const categoriesIds$: Observable<number[]> = combineLatest([existingCategoriesIds$, newCategoriesIds$]).pipe(
      map(([existingIds, newIds]) => [...existingIds, ...newIds])
    )

    return categoriesIds$;
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
