import { Injectable } from '@nestjs/common';
import { MeedanCheckClientService } from 'libs/meedan-check-client/src/lib/meedan-check-client.service';
import { CommentStatus, CreatePostDto, PostFormat, PostStatus } from 'libs/wp-client/src/lib/interfaces/create-post.dto';
import { CreateTagDto } from 'libs/wp-client/src/lib/interfaces/create-tag.dto';
import { WpClientService } from 'libs/wp-client/src/lib/wp-client.service';
import { combineLatest, from, iif, Observable, of } from 'rxjs';
import { concatMap, map, scan, switchMap } from 'rxjs/operators';

@Injectable()
export class AppService {
  constructor(
    private checkClient: MeedanCheckClientService, 
    private wpClient: WpClientService
    ){}
  
  publishReportById(id: string): Observable<any>{
    const report$: Observable<any> = this.checkClient.getReport(id);
    const tagsIds$: Observable<number[]> = report$.pipe(
      map(report => report.tags),
      switchMap(tags => iif(() => !!tags.length, this.tagsIds(tags), of(null)))
    )
    const post$: Observable<any> = combineLatest([report$, tagsIds$]).pipe(
      map(([report, tagsIds]) => this.buildPostFromReport(report, tagsIds)),
      switchMap(postDto => this.wpClient.publishPost(postDto))
    )

    //TODO: 
    // - manage categories similarly to tags
    // - after the report is created we must create the associated media
    // - get the posts author 

    return report$
  }

  private buildPostFromReport(report: any, tags: number[]): CreatePostDto{
    const status = PostStatus.publish;
    const comment_status = CommentStatus.open;
    const format = PostFormat.standard;
    return {
      format,
      //author,
      // title,
      // content,
      // meta,
      comment_status,
      status,
      // categories,
      tags
    }
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

  private createManyTags(tags: string[]): Observable<any>{
    const tagsDtos: CreateTagDto[] = tags.map(tag => ({name: tag})) 
    return from(tagsDtos).pipe(
      concatMap(tag => this.createSingleTag(tag))
    )
  }

  private createSingleTag(tag: CreateTagDto): Observable<any>{
    return this.wpClient.createTag(tag)
  }
}
