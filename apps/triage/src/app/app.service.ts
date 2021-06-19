import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { CrowdtangleClientService } from 'libs/crowdtangle-client/src/lib/crowdtangle-client.service';
import { MeedanCheckClientService, ToxicityScores } from '@iverify/meedan-check-client';
import { MlServiceClientService } from 'libs/ml-service-client/src/lib/ml-service-client.service';
import { BehaviorSubject, combineLatest, from, iif, Observable, of } from 'rxjs';
import { catchError, concatMap, filter, map, reduce, scan, skip, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { TriageConfig } from './config';

@Injectable()
export class AppService {
  

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
        const pagination = {count: 3, offset: 0, iterations: 0};
        const toxicPostsByList = await this.getToxicPostsByList(listId.toString(), pagination);
        toxicPosts = [...toxicPosts, ...toxicPostsByList]
      } 
      let createdItems = [];
      for(const post of toxicPosts){
        console.log('uploading on meadan n.:', toxicPosts.length)
        console.log('post: ', post)
        const item = await this.checkClient.createItem(post.postUrl, post.toxicScores).toPromise();
        createdItems = [...createdItems, item];
        console.log('created items: ', createdItems.length)
      }
      console.log('created items: ', createdItems)
      return createdItems;
    } catch(e){
      throw new HttpException(e.message, 500);
    }
  }

  private async getToxicPostsByList(listId: string, pagination: any, posts?: any[]){
    if(!posts) posts = [];
    try{
      console.log('fetching iterations n.: ', pagination.iterations);
      console.log('fetching posts with offset: ', pagination.offset);
      const res = await this.ctClient.getPosts(listId, pagination.count, pagination.offset).toPromise();
      console.log('received n. posts: ', res.posts.length);
      console.log('has next page: ', !!res.pagination.nextPage);
      for(const post of res['posts']){
        const toxicScores = await this.mlClient.analyze([post.message]).toPromise();
        const isToxic = this.isToxic(toxicScores);
        if(isToxic) posts.push({...post, toxicScores});
        console.log('analyzed post with id: ', post.id);
        console.log('toxicScores: ', toxicScores)
        console.log('is toxic: ', isToxic);
        console.log('toxic posts so far: ', posts.length);
      }
      if(res['pagination'] && res.pagination['nextPage']){
        const iterations = pagination.iterations + 1;
        const offset = pagination.count * iterations;
        console.log('fetching additional pages...')
        return await this.getToxicPostsByList(listId, {...pagination, offset, iterations}, posts)
      } else {
        console.log('no more pages.')
        return posts
      };
    }catch(e){
      throw new HttpException(e.message, 500);
    }
  }

  private isToxic(toxicScores: ToxicityScores): Boolean{
    return Object.keys(toxicScores).reduce((acc, val) => {
      if(toxicScores[val] > this.config.toxicTreshold) acc = true;
      return acc;
    }, false)
  }
}
