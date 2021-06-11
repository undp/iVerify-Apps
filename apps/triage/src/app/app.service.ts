import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { CrowdtangleClientService } from 'libs/crowdtangle-client/src/lib/crowdtangle-client.service';
import { MlServiceClientService } from 'libs/ml-service-client/src/lib/ml-service-client.service';
import { combineLatest, from, Observable, of } from 'rxjs';
import { catchError, concatMap, map, scan, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';

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
    scan((acc, val) => [...acc, ...val], []),
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
      return {...post, toxicScores}
    }),
    scan((acc, val) => {
      if(this.isToxic(val)){
        return [...acc, val]
      } else {
        return [...acc]
      }
    }, []),
    catchError(err => {
      throw new HttpException(err.message, 500);
    })
  )

  constructor(private ctClient: CrowdtangleClientService, private mlClient: MlServiceClientService){}
  analyze() {
    return this.analyzedPosts$;
  }

  private analyzePost(post: any): Observable<any>{
    const message = post.message;
    return this.mlClient.analyze([message])
  }

  private isToxic(post: any): Boolean{
    const toxicScores = post.toxicScores;
    return Object.keys(toxicScores).reduce((acc, val) => {
      if(toxicScores[val] > 0.01) acc = true;
      return acc;
    }, false)
  }
}
