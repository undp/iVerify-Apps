import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { CrowdtangleClientService } from 'libs/crowdtangle-client/src/lib/crowdtangle-client.service';
import { MeedanCheckClientService, ToxicityScores } from '@iverify/meedan-check-client';
import { MlServiceClientService } from 'libs/ml-service-client/src/lib/ml-service-client.service';
import { BehaviorSubject, combineLatest, from, iif, Observable, of } from 'rxjs';
import { catchError, concatMap, filter, map, reduce, scan, skip, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { TriageConfig } from './config';

@Injectable()
export class AppService {
  paginator = new BehaviorSubject<{offset: number, iterations: number}>({offset: 0, iterations: 0});
  paginator$ = this.paginator.asObservable();

  nextPage = new BehaviorSubject<boolean>(false);
  nextPage$ = this.nextPage.asObservable();
  
  postsEmitted = new BehaviorSubject<number>(0);
  postsEmitted$ = this.postsEmitted.asObservable();

  listsIds$: Observable<any> = this.ctClient.getLists().pipe(
    map(lists => lists.filter(list => list.type === 'SAVED_SEARCH')),
    map(lists => lists.map(list => list.id)),
    switchMap(listsIds => from(listsIds)),
    catchError(err => {
      throw new HttpException(err.message, 500);
    })
  )

  postsResponse$: Observable<any> = this.listsIds$.pipe(
    concatMap(listId => combineLatest([of(listId), this.paginator$])),
    map(([listId, paginator]) => ({listId, paginator})),
    tap(data => {
      console.log('listid: ', data.listId);
      console.log('offset: ', data.paginator.offset);
      console.log('iteration: ', data.paginator.iterations)
    }),
    concatMap(data => this.ctClient.getPosts(data.listId.toString(), data.paginator.offset)),
    catchError(err => {
      throw new HttpException(err.message, 500);
    })
  )

  analyzedPost$: Observable<any> = this.postsResponse$.pipe(
    concatMap(res => from(res.posts)),
    concatMap(post => {
      const toxicScores$: Observable<any> = this.analyzePost(post);
      return combineLatest([of(post) as Observable<Object>, toxicScores$])
    }),
    map(([post, toxicScores]) => {
        console.log('Post id: ', post['id'])
        console.log('Toxic score: ', toxicScores)
        return {...post, toxicScores}
      }),
    scan((acc, val) => {
      const count = acc.count + 1;
      return {post: val, count}
    }, {post: null, count: 0}),    
    
  )
    
  filteredPosts$: Observable<any> = this.analyzedPost$.pipe(
    withLatestFrom(this.postsResponse$, this.paginator$),
    map(([postWithCount, res, paginator]) => ({post: postWithCount.post, count: postWithCount.count, res, paginator})),  
    tap(data => {
      const batchDone = data.count === data.res.posts.length; 
      const hasNextPage = data.res.pagination && data.res.pagination.nextPage;
      if(hasNextPage && batchDone){
        const iterations = data.paginator.iterations + 1;
        const offset = 5 * iterations;
        this.paginator.next({offset, iterations})
      } 
      else if(!hasNextPage && batchDone){
        this.paginator.complete();
      }
    }),
    map(data => data.post),
    reduce((acc, val) => {
      if(this.isToxic(val.toxicScores)) return [...acc, val];
      else return acc;
    }, []),
    tap(results => console.log('results: ', results))
  )


    
  //   
  //   concatMap(post => iif(() => !!this.isToxic(post.toxicScores), this.checkClient.createItem(post['postUrl'], post.toxicScores), of(null))),
  //   withLatestFrom(this.nextPage$, this.paginator$, this.postsEmitted$),
  //   map(([item, nextPage, paginator, postsEmitted]) => ({item, nextPage, paginator, postsEmitted})),
  //   tap(data => {
  //     this.postsEmitted.next(data.postsEmitted + 1)
  //     console.log('data: ', data)
  //     if(data.nextPage) {
  //       const iterations = data.paginator.iterations + 1;
  //       const offset = 5 * iterations;
  //       this.paginator.next({offset, iterations})
  //     } else {
  //       if(data.postsEmitted + 1 === 5 * (data.paginator.iterations + 1))
  //       this.paginator.complete()
  //     }
  //   }),
  //   map(data => data.item),
  //   reduce((acc, val) => {
  //     if(!!val) return [...acc, val]
  //     else return acc;
  //   }, []),
  //   tap(data => console.log('posts lenght: ', data.length)),
  //   catchError(err => {
  //     throw new HttpException(err.message, 500);
  //   })
  // )

  // analyzedPosts$: Observable<any> = this.posts$.pipe(
  //   switchMap(posts => from(posts)),
  //   concatMap(post => {
  //     const toxicScores$: Observable<any> = this.analyzePost(post);
  //     return combineLatest([of(post) as Observable<Object>, toxicScores$])
  //   }),
  //   map(([post, toxicScores]) => {
  //     console.log('Post id: ', post['id'])
  //     console.log('Toxic score: ', toxicScores)
  //     return {post, toxicScores}
  //   }),
  //   filter(data => !!this.isToxic(data.toxicScores)),
  //   concatMap(data => {
  //     return this.checkClient.createItem(data.post['postUrl'], data.toxicScores);
  //   }),
  //   scan((acc, val) => {
  //     return [...acc, val]
  //   }, []),
  //   tap(result => console.log('result length...: ', result.length)),
  //   catchError(err => {
  //     throw new HttpException(err.message, 500);
  //   })
  // )

  constructor(
    private ctClient: CrowdtangleClientService, 
    private mlClient: MlServiceClientService,
    private checkClient: MeedanCheckClientService,
    private config: TriageConfig
    ){}
  async analyze() {
    try{
      const lists = await this.ctClient.getLists().toPromise();
      const savedSearches = lists.filter(list => list.type === 'SAVED_SEARCH');
      const listsIds = savedSearches.map(list => list.id);
      let toxicPosts = [];
      for(const listId of listsIds){
        const pagination = {offset: 0, iterations: 0};
        const toxicPostsByList = await this.getToxicPostsByList(listId.toString(), pagination);
        toxicPosts = [...toxicPosts, ...toxicPostsByList]
      } 
      let createdItems = [];
      for(const post of toxicPosts){
        const item = await this.checkClient.createItem(post.url, post.toxicScores).toPromise();
        createdItems = [...createdItems, item];
      }
      return createdItems;
    } catch(e){
      throw new HttpException(e.message, 500);
    }
  }

  async getToxicPostsByList(listId: string, pagination: any, posts?: any[]){
    if(!posts) posts = [];
    try{
      console.log('fetching iterations n.: ', pagination.iterations);
      console.log('fetching posts with offset: ', pagination.offset);
      const res = await this.ctClient.getPosts(listId, pagination.offset).toPromise();
      console.log('received n. posts: ', res.posts.length);
      console.log('has next page: ', res.pagination.nextPage);
      console.log('res pagination: ', res.pagination)
      for(const post of res['posts']){
        const toxicScores = await this.mlClient.analyze([post.message]).toPromise();
        const isToxic = this.isToxic(toxicScores);
        if(isToxic) posts.push({...post, toxicScores});
        console.log('analyzed post with id: ', post.id);
        console.log('is toxic: ', isToxic);
        console.log('toxic posts so far: ', posts.length);
      }
      if(res['pagination'] && res.pagination['nextPage']){
        const iterations = pagination.iterations + 1;
        const offset = 20 * iterations;
        console.log('fetching additional pages...')
        return await this.getToxicPostsByList(listId, {offset, iterations}, posts)
      } else {
        console.log('no more pages.')
        return posts
      };
    }catch(e){
      throw new HttpException(e.message, 500);
    }
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
