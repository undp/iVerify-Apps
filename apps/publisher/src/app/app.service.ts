import { Injectable } from '@nestjs/common';
import { MeedanCheckClientService } from 'libs/meedan-check-client/src/lib/meedan-check-client.service';
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
    const reportTags$: Observable<any> = report$.pipe(
      map(report => report.tags)
    )
    const tagsIds$: Observable<number[]> = reportTags$.pipe(
      switchMap(tags => iif(() => !!tags.length, this.tagsIds(tags), of(null)))
    )

    //TODO: author, gategories

    return combineLatest([report$, tagsIds$]).pipe(
      map(([report, tags]) => this.buildPostFromReport(report, tagsIds)),
      switchMap(postDto => this.wpClient.publishPost(postDto))
    )
  }

  tagsIds(tags: string[]): Observable<number[]>{
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

  createManyTags(tags: string[]): Observable<any>{
    const tagsDtos: CreateTagDto[] = tags.map(tag => ({name: tag})) 
    return from(tagsDtos).pipe(
      concatMap(tag => this.createSingleTag(tag))
    )
  }

  createSingleTag(tag: CreateTagDto): Observable<any>{
    return this.wpClient.createTag(tag)
  }
}
