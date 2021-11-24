import { Injectable } from "@nestjs/common";

@Injectable()
export class SharedHelper{
    constructor(){}

    extractTask(report: any, label: string){
        const edges = report.tasks.edges;
        if(!edges.length) return '';
        const node =  edges.find(node => node.node.label === label);
        const res = node && node.node.first_response_value ? node.node.first_response_value : '';
        return res;
      }
    
    extractTags(report: any): string[]{
        return report.tags.edges.reduce((acc, val) => {
            acc = [...acc, val.node.tag_text]
            return acc;
        }, []);
    }

    extractFactcheckingStatus(report: any){
        const field = report.annotation.data.fields.find(field => field.field_name === 'verification_status_status');
        return field.formatted_value;
      }

    extractTitle(report: any){
        return report.project_media.title || '';
    }

    extractDescription(report: any){
        return report.project_media.description || '';
    }

    extractDbid(report: any){
        return report.project_media.dbid || '';
    }

    extractSourceDomain(report: any){
        return report.project_media.domain || '';
    }

    extractSourceName(report: any){
        return report.project_media.source.name || '';
    }
}
