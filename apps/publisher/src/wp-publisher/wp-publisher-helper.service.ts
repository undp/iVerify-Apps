import { getLabel, MeedanLabels,} from "@iverify/common/src";
import { Injectable } from "@nestjs/common";
import { CommentStatus, CreatePostDto, PostFields, PostFormat, PostStatus } from "libs/wp-client/src/lib/interfaces/create-post.dto";
import { SharedHelper } from "../shared/helper";
var showdown  = require('showdown')

@Injectable()
export class WpPublisherHelper{
    lang = process.env.language + `-` + process.env.COUNTRY_CODE;

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

        const violation_type = this.sharedHelper.extractTask(report, getLabel(this.lang, MeedanLabels.VIOLATION_TYPE));
        // const toxicField = this.sharedHelper.extractTask(report, TasksLabels[this.lang].toxic);
        // const toxic = !!toxicField ? 1 : 0;
        const toxic = (violation_type === getLabel(this.lang, MeedanLabels.VIOLATION_HATE_SPEECH)) ? 1 : 0;
        const factchecking_status = this.extractFactcheckingStatus(report);
        const claim = this.sharedHelper.extractTitle(report);
        // this.sharedHelper.extractTask(report, TasksLabels[this.lang].claim);
        let rating_justification = this.sharedHelper.extractTask(report, getLabel(this.lang, MeedanLabels.RATING_JUSTIFICATION));
        rating_justification = this.formatMarkupText(rating_justification);
        const evidence = this.sharedHelper.extractTask(report,getLabel(this.lang, MeedanLabels.EVIDENCES_AND_REFERENCES));
        const evidence_and_references = this.formatEvidence(evidence);
        const _webdados_fb_open_graph_specific_image = visualCard;
        const category = this.sharedHelper.extractTask(report, getLabel(this.lang, MeedanLabels.CATEGORY_CHECKED));
        const fields: PostFields = {check_id, factchecking_status, claim, rating_justification, evidence_and_references, subtitle, toxic,category};
        console.log('visual card url: ', _webdados_fb_open_graph_specific_image)
        const email_address = this.sharedHelper.extractTask(report, getLabel(this.lang, MeedanLabels.EMAIL_ADDRESS));
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
          _webdados_fb_open_graph_specific_image,
          email_address
        }

        if(!post.featured_media) delete post.featured_media;

        return post;
    }

    extractFactcheckingStatus(report: any){
      return this.sharedHelper.extractFactcheckingStatus(report);
    }

    formatEvidence(evidence: string){

      if (process.env.TEXT_PARSER === 'v2') {
        return this.formatMarkupText(evidence)
      }

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

    formatMarkupText(evidence: string) {
      // const words = evidence.split(' ');
      // let updated_test = '';
      // for (var word of words) {
      //     if (word.startsWith('http://') || word.startsWith('https://') || word.startsWith('www.')) {
      //         word = `<a href=${word} target="_blank" rel="noopener noreferrer">${word}</a>`
      //     }

      //     updated_test += (word + ' ')
      // }

      try {
        const converter = new showdown.Converter({simplifiedAutoLink: true, simpleLineBreaks: true, openLinksInNewWindow: true, emoji: true});
        converter.setFlavor('github');
        return converter.makeHtml(evidence);
      } catch (err) {
        return evidence;
      }
    }
}




