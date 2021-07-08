import { Injectable } from "@nestjs/common";
import { StatusesMap } from "libs/meedan-check-client/src/lib/interfaces/statuses-map";
import { CountBy } from "./models/count-by.enum";
import { Stats } from "./models/stats.model";

@Injectable()
export class StatsFormatService{
    formatTticketsByAgent(startDate: Date, endDate: Date, results: any): Stats[]{
        const edges: any[] = results.search.medias.edges;
        const unstartedStatuses = StatusesMap.filter(status => status.default).map(status => status.value);
        const processingStatuses = StatusesMap.filter(status => !status.default && !status.resolution).map(status => status.value);
        const resolutionStatuses = StatusesMap.filter(status => status.resolution).map(status => status.value);

        const unstarted = edges.filter(val => unstartedStatuses.indexOf(val.node.status) > -1);
        const processing = edges.filter(val => processingStatuses.indexOf(val.node.status) > -1);
        const solved = edges.filter(val => resolutionStatuses.indexOf(val.node.status) > -1);

        const unstartedCount = unstarted.reduce((acc, val) => {
            const user = val.node.account && val.node.account.user && val.node.account.user.name  ? val.node.account.user.name : 'undefined';
            if(!acc[user]) acc[user] = 1;
            else acc[user]++;
            return acc;
        }, {});

        const processingCount = processing.reduce((acc, val) => {
            const user = val.node.account && val.node.account.user && val.node.account.user.name  ? val.node.account.user.name : 'undefined';
            if(!acc[user]) acc[user] = 1;
            else acc[user]++;
            return acc;
        }, {});

        const solvedCount = solved.reduce((acc, val) => {
            const user = val.node.account && val.node.account.user && val.node.account.user.name  ? val.node.account.user.name : 'undefined';
            if(!acc[user]) acc[user] = 1;
            else acc[user]++;
            return acc;
        }, {});

        return [
            ...this.buildStatsFromCount(startDate, endDate, unstartedCount, CountBy.agentUnstarted),
            ...this.buildStatsFromCount(startDate, endDate, processingCount, CountBy.agentProcessing),
            ...this.buildStatsFromCount(startDate, endDate, solvedCount, CountBy.agentSolved)
        ];
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

    formatTticketsByStatus(startDate: Date, endDate: Date, results: any): Stats[]{
        
// [
//   {
//     "search": {
//       "number_of_results": 45
//     },
//     "status": "undetermined"
//   },
//   {
//     "search": {
//       "number_of_results": 14
//     },
//     "status": "in_progress"
//   },
        const count = results.reduce((acc, val) => {
            const status: string = StatusesMap.find(i => i.value === val.status).label;
            acc[status] = val.search.number_of_results;
            return acc;
        }, {});
        return this.buildStatsFromCount(startDate, endDate, count, CountBy.status);

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

    formatResponseTime(startDate, endDate, title, resolutionTime): Partial<Stats>{
        return {
            startDate,
            endDate,
            countBy: CountBy.resolutionVelocity,
            category: title,
            count: resolutionTime
        }
    }

    formatResolutionTime(startDate, endDate, title, resolutionTime): Partial<Stats>{
        return {
            startDate,
            endDate,
            countBy: CountBy.resolutionVelocity,
            category: title,
            count: resolutionTime
        }
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