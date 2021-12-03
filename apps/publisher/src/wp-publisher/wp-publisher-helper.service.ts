import { Injectable } from "@nestjs/common";
import { CommentStatus, CreatePostDto, PostFields, PostFormat, PostStatus } from "libs/wp-client/src/lib/interfaces/create-post.dto";
import { SharedHelper } from "../shared/helper";
import { TasksLabels } from '@iverify/iverify-common';

@Injectable()
export class WpPublisherHelper{
    lang = process.env.LANGUAGE;

    constructor(private sharedHelper: SharedHelper){}

    extractMedia(report: any): string{
        return report.media.metadata.picture;
    }

    extractTags(report: any): string[]{
      return this.sharedHelper.extractTags(report);
    }


    buildPostFromReport(
        report: any, 
        meedanReport: any,
        // categories: number[], 
        author: number,
        media: number,
        tags: number[],
        categories: number[],
        visualCard: string): CreatePostDto{
        
        const status = PostStatus.publish;
        const comment_status = CommentStatus.open;
        const format = PostFormat.standard;
        const check_id = report.dbid;
        const title = meedanReport.title;
        const subtitle = meedanReport.description;
        const toxicField = this.sharedHelper.extractTask(report, TasksLabels[this.lang].toxic);
        const toxic = !!toxicField ? 1 : 0;
        const factchecking_status = this.extractFactcheckingStatus(report);
        const claim = this.sharedHelper.extractTask(report, TasksLabels[this.lang].claim);
        const rating_justification = this.sharedHelper.extractTask(report, TasksLabels[this.lang].rating_justification);
        const evidence = this.sharedHelper.extractTask(report, TasksLabels[this.lang].evidences_and_references);
        const evidence_and_references = this.formatEvidence(evidence);
        const _webdados_fb_open_graph_specific_image = visualCard;
        const fields: PostFields = {check_id, factchecking_status, claim, rating_justification, evidence_and_references, subtitle, toxic};
        console.log('visual card url: ', _webdados_fb_open_graph_specific_image)
    
        const post: CreatePostDto = {
          format,
          author,
          title,
          comment_status,
          status,
          featured_media: media,
          tags,
          fields,
          categories,
          _webdados_fb_open_graph_specific_image
        }

        if(!post.featured_media) delete post.featured_media;

        return post;
    }    

    extractFactcheckingStatus(report: any){
      return this.sharedHelper.extractFactcheckingStatus(report);
    }

    formatEvidence(evidence: string){
      let blocksArr = evidence.split('DESCRIPTION');
      blocksArr.shift();
      const lis = blocksArr.reduce((acc, val) => {
        if(val.length){
          const linkArr = val.split('LINK');
          if(linkArr.length){
            const html = `<li><a href=${linkArr[1]} target="_blank" rel="noopener noreferrer">${linkArr[0]}</a></li>`
            acc = acc + html;
          }
        }
        return acc;
      }, '');
      return `<ul>${lis}</ul>`
    }
}




