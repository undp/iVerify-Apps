import { HttpException, HttpService, Injectable, Logger } from '@nestjs/common';
import { CrowdtangleClientService } from 'libs/crowdtangle-client/src/lib/crowdtangle-client.service';
import { MeedanCheckClientService, ToxicityScores } from '@iverify/meedan-check-client';
import { MlServiceClientService } from 'libs/ml-service-client/src/lib/ml-service-client.service';
import { TriageConfig } from './config';
import { PerspectiveClientService } from '@iverify/perspective-client/src/lib/perspective-client.service';
import { MlServiceType } from '@iverify/iverify-common';

@Injectable()
export class AppService {
  private readonly logger = new Logger('TriageAppService');
  

  constructor(
    private ctClient: CrowdtangleClientService, 
    private mlClient: MlServiceClientService,
    private perspectiveClient: PerspectiveClientService,
    private checkClient: MeedanCheckClientService,
    private config: TriageConfig
    ){}

  async analyze(startDate: string, endDate: string): Promise<number> {
    try{
      const lists = await this.ctClient.getLists().toPromise();
      const savedSearches = lists.filter(list => list.type === 'SAVED_SEARCH');
      const listsIds = savedSearches.map(list => list.id);
      let toxicPosts = [];
      for(const listId of listsIds){
        const pagination = {count: 100, offset: 0, iterations: 0};
        const toxicPostsByList = await this.getToxicPostsByList(listId.toString(), pagination, startDate, endDate, []);
        toxicPosts = [...toxicPosts, ...toxicPostsByList]
      } 
      if(!toxicPosts.length){
        this.logger.log('No toxic posts found.')
        return 0;
      }
      let createdItems = [];
      const uniqueToxicPosts = [...new Set(toxicPosts)]
      this.logger.log(`${uniqueToxicPosts.length} toxic posts found. Creating Meedan Check items...`);
      for(const post of uniqueToxicPosts){
        this.logger.log('Creating item...')
        const item = await this.checkClient.createItem(post.postUrl, post.toxicScores).toPromise();
        console.log('item: ', item)
        if(!item.error) createdItems = [...createdItems, item];
      }
      this.logger.log(`Created ${createdItems.length} items.`)
      return createdItems.length;
    } catch(e){
      this.logger.error('Analyze error: ', e.message);
      throw new HttpException(e.message, 500);
    }
  }

  private async getToxicPostsByList(listId: string, pagination: any, startDate: string, endDate: string, posts: any[]){
    try{
      this.logger.log(`Fething posts with params: 
        listId - ${listId}, 
        count - ${pagination.count}, 
        offset - ${pagination.offset}, 
        startDate - ${startDate},
        endDate - ${endDate}`);
      this.logger.log(`Max post scan limit - ${this.config.postScanLimit}`)
      const res = await this.ctClient.getPosts(listId, pagination.count, pagination.offset, startDate, endDate).toPromise();
      this.logger.log(`Received ${res.posts.length} posts. Analyzing...`)
      let postsCount = 0;
      for(const post of res['posts']){
        const postMessage = post.message ? post.message : '';
        const postDescription = post.description ? post.description : '';
        const text = `${postMessage}. ${postDescription}`;
        this.logger.log(`Sending post for analysis...`)
        const toxicScores = await this.mlAnalyze(text);
        this.logger.log(`Received toxic score: ${toxicScores}`)
        const isToxic = toxicScores && toxicScores.toxicity ? this.isToxic(toxicScores, post.postUrl, text.length) : false;
        if(isToxic) posts.push({...post, toxicScores});
        postsCount++;
      }
      const totalPostsAnalyzed = pagination.iterations * pagination.count + postsCount;
      this.logger.log(`Analyzed ${totalPostsAnalyzed} posts, toxic so far: ${posts.length}`);
      if(res['pagination'] && res.pagination['nextPage']){
        const iterations = pagination.iterations + 1;
        const offset = pagination.count * iterations;
        if(offset < this.config.postScanLimit) {
          return await this.getToxicPostsByList(listId, {...pagination, offset, iterations}, startDate, endDate, posts);
        } else {
          this.logger.log(`Max post scan limit reached ${this.config.postScanLimit} - skipping other posts`)
          return posts;
        }
      } else {
        this.logger.log(`No more pages.`)
        return posts
      };
    }catch(e){
      this.logger.error('Error fetching and analyzing posts: ', e.message);
      throw new HttpException(e.message, 500);
    }
  }

  private isToxic(toxicScores: ToxicityScores, postUrl: string, textLength: number): Boolean{
    if(!toxicScores) {
      this.logger.warn(`Invalid toxicScores for post ${postUrl} with text length ${textLength}, toxicScores: ${toxicScores}. Flagging post as non-toxic.`)
      return false
    }
    return Object.keys(toxicScores).reduce((acc, val) => {
      if(toxicScores[val] > this.config.toxicTreshold) acc = true;
      return acc;
    }, false)
  }

  async createItemFromWp(url: string, content: string){
    return await this.checkClient.createItemFromWp(url.trim(), content);
  }

  private async mlAnalyze(text: string){
    switch(this.config.mlServiceType){
      case MlServiceType.UNICC_DETOXIFY_1: return await this.mlClient.analyze([text]).toPromise();
      case MlServiceType.PERSPECTIVE: return await this.perspectiveClient.analyze(text, this.config.toxicTreshold).toPromise();
    }
  }
}
