import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { CrowdtangleClientService } from 'libs/crowdtangle-client/src/lib/crowdtangle-client.service';
import { MeedanCheckClientService, ToxicityScores } from '@iverify/meedan-check-client';
import { MlServiceClientService } from 'libs/ml-service-client/src/lib/ml-service-client.service';
import { combineLatest, from, Observable, of } from 'rxjs';
import { catchError, concatMap, filter, map, scan, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { TriageConfig } from './config';

@Injectable()
export class AppService {
  listsIds$: Observable<any> = this.ctClient.getLists().pipe(
    map(lists => lists.filter(list => list.type === 'SAVED_SEARCH')),
    map(lists => lists.map(list => list.id)),
    catchError(err => {
      throw new HttpException(err.message, 500);
    })
  )

  posts$: Observable<any> = this.listsIds$.pipe(
    switchMap(listsIds => from(listsIds)),
    concatMap(listId => this.ctClient.getPosts(listId.toString())),
    tap(posts => console.log('posts: ', posts)),
    scan((acc, val) => [...acc, ...val], []),
    tap(res => console.log('res: ', res)),
    catchError(err => {
      throw new HttpException(err.message, 500);
    })
  )

  analyzedPosts$: Observable<any> = this.posts$.pipe(
    switchMap(posts => from(posts)),
    concatMap(post => {
      const toxicScores$: Observable<any> = this.analyzePost(post);
      return combineLatest([of(post) as Observable<Object>, toxicScores$])
    }),
    map(([post, toxicScores]) => {
      console.log('Post id: ', post['id'])
      console.log('Toxic score: ', toxicScores)
      return {post, toxicScores}
    }),
    filter(data => !!this.isToxic(data.toxicScores)),
    concatMap(data => {
      return this.checkClient.createItem(data.post['postUrl'], data.toxicScores);
    }),
    scan((acc, val) => {
      console.log('checkItem: ', val)
      return [...acc, val]
    }, []),
    catchError(err => {
      throw new HttpException(err.message, 500);
    })
  )

  constructor(
    private ctClient: CrowdtangleClientService, 
    private mlClient: MlServiceClientService,
    private checkClient: MeedanCheckClientService,
    private config: TriageConfig
    ){}
  analyze() {
    return this.analyzedPosts$;
  }

  private analyzePost(post: any): Observable<any>{
    const message = post.message;
    return this.mlClient.analyze([message])
  }

  private isToxic(toxicScores: ToxicityScores): Boolean{
    return Object.keys(toxicScores).reduce((acc, val) => {
      if(toxicScores[val] > this.config.toxicTreshold) acc = true;
      return acc;
    }, false)
  }
}
