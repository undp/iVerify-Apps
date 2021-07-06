import { Injectable } from "@nestjs/common";
import { CountBy } from "./models/count-by.enum";
import { Stats } from "./models/stats.model";

@Injectable()
export class StatsFormatService{
    formatTticketsByAgent(startDate: Date, endDate: Date, results: any): Stats[]{
        const edges: any[] = results.search.medias.edges;
        const count = edges.reduce((acc, val) => {
            const user = val.node.account && val.node.account.user && val.node.account.user.name  ? val.node.account.user.name : 'undefined';
            if(!acc[user]) acc[user] = 1;
            else acc[user]++;
            return acc;
        }, {});
        return this.buildStatsFromCount(startDate, endDate, count, CountBy.agent);
    }
    
    formatTticketsByChannel(any): Stats[]{
        return [];
    }

    formatTticketsByTags(startDate: Date, endDate: Date, results): Stats[]{
        const count = results.reduce((acc, val) => {
            const tag: string = val.tag;
            acc[tag] = val.search.number_of_results;
            return acc;
        }, {});
        return this.buildStatsFromCount(startDate, endDate, count, CountBy.tag);
    }

    formatTticketsByStatus(any): Stats[]{
        return [];
    }

    formatTticketsBySource(startDate: Date, endDate: Date, results: any): Stats[]{
        const edges: any[] = results.search.medias.edges;
        const count = edges.reduce((acc, val) => {
            const domain: string = val.node.domain;
            if(!acc[domain]) acc[domain] = 1;
            else acc[domain]++;
            return acc;
        }, {});
        return this.buildStatsFromCount(startDate, endDate, count, CountBy.source);
    }

    formatTticketsByType(any): Stats[]{
        return [];
    }

    formatCreatedVsPublished(startDate, endDate, results): Stats[]{
        const count = results.reduce((acc, val) => {
            const status: string = val.status;
            acc[status] = val.search.number_of_results;
            return acc;
        }, {});
        return this.buildStatsFromCount(startDate, endDate, count, CountBy.createdVsPublished);
    }

    private buildStatsFromCount(startDate: Date, endDate: Date, count: Object, countBy: CountBy){
        return Object.keys(count).reduce((acc, val) => {
            const stat: Partial<Stats> = {
                startDate,
                endDate,
                countBy,
                category: val,
                count: count[val]
            }
            acc.push(stat);
            return acc;
        }, [])
    }

}