import { Injectable } from "@nestjs/common";
import { CountBy, StatusesMap } from "@iverify/iverify-common";
import { Stats } from "./models/stats.model";

@Injectable()
export class StatsFormatService{
    unstartedStatuses = StatusesMap.filter(status => status.default).map(status => status.value);
    processingStatuses = StatusesMap.filter(status => !status.default && !status.resolution).map(status => status.value);
    resolutionStatuses = StatusesMap.filter(status => status.resolution).map(status => status.value);

    constructor(){}
    
    formatDate(date: Date){
        return `${date.getUTCFullYear()}-${date.getUTCMonth() +1}-${date.getUTCDate()}`
    }

    formatTticketsByAgent(endDate: string, results: any): Stats[]{
        const unstarted = results.filter(val => this.unstartedStatuses.indexOf(val.status) > -1);
        const processing = results.filter(val => this.processingStatuses.indexOf(val.status) > -1);
        const solved = results.filter(val => this.resolutionStatuses.indexOf(val.status) > -1);

        const unstartedCount = unstarted.reduce((acc, val) => {
            const user = val.agent ? val.agent : 'undefined';
            if(!acc[user]) acc[user] = val.count;
            else acc[user] = acc[user] + val.count;
            return acc;
        }, {});

        const processingCount = processing.reduce((acc, val) => {
            const user = val.agent ? val.agent : 'undefined';
            if(!acc[user]) acc[user] = val.count;
            else acc[user] = acc[user] + val.count;
            return acc;
        }, {});

        const solvedCount = solved.reduce((acc, val) => {
            const user = val.agent ? val.agent : 'undefined';
            if(!acc[user]) acc[user] = val.count;
            else acc[user] = acc[user] + val.count;
            return acc;
        }, {});


        return [
            ...this.buildStatsFromCount(endDate, unstartedCount, CountBy.agentUnstarted),
            ...this.buildStatsFromCount(endDate, processingCount, CountBy.agentProcessing),
            ...this.buildStatsFromCount(endDate, solvedCount, CountBy.agentSolved)
        ];
    }
    
    formatTticketsByChannel(any): Stats[]{
        return [];
    }

    formatTticketsByTags(endDate: string, results): Stats[] {
        
        const count = results.reduce((acc, val) => {
            if (val.search.number_of_results > 0) {
                const tag: string = val.tag;
                acc[tag] = val.search.number_of_results;
            }
            return acc;
        }, {});
        return this.buildStatsFromCount(endDate, count, CountBy.tag);
    }

    formatTticketsByViolation(endDate: string, results): Stats[] {
        
        const count = results.reduce((acc, val) => {
            const violation: string = val.violation;
            acc[violation] = val.count;
            return acc;
        }, {});
        return this.buildStatsFromCount(endDate, count, CountBy.violationType);
    }

    formatTticketsByStatus(endDate: string, results: any): Stats[]{
        
        const count = results.reduce((acc, val) => {
            const status: string = StatusesMap.find(i => i.value === val.status).label;
            if (val.search.number_of_results > 0) {
                acc[status] = val.search.number_of_results;
            }
            return acc;
        }, {});
        return this.buildStatsFromCount(endDate, count, CountBy.status);

    }

    formatTticketsBySource(endDate: string, results: any): Stats[]{
        const edges: any[] = results.search.medias.edges;
        const count = edges.reduce((acc, val) => {
            const domain: string = val.node.domain;
            if(!acc[domain]) acc[domain] = 1;
            else acc[domain]++;
            return acc;
        }, {});
        return this.buildStatsFromCount(endDate, count, CountBy.source);
    }

    formatTticketsByType(endDate: string, results: any): Stats[]{
        const edges: any[] = results.search.medias.edges;
        const solved = edges.filter(val => this.resolutionStatuses.indexOf(val.node.status) > -1);

        const solvedCount = solved.reduce((acc, val) => {
            const tasksEdges = val.node.tasks.edges;
            const nodeType = tasksEdges.find(taskNode => taskNode.node.label == 'Type of Violation');
            const violationType = nodeType && nodeType.node ? nodeType.node.first_response_value : null;
            if (violationType.length > 0) {
                if (acc && violationType && !acc[violationType]) {
                    acc[violationType] = 1;
                } else {
                    acc[violationType]++;
                }
            }
            return acc;
            
        }, {});

        return this.buildStatsFromCount(endDate, solvedCount, CountBy.type);
    }

    formatCreatedVsPublished(endDate, results): Stats[]{
        const count = results.reduce((acc, val) => {
            const status: string = val.status;
            acc[status] = val.search.number_of_results;
            return acc;
        }, {});
        return this.buildStatsFromCount(endDate, count, CountBy.createdVsPublished);
    }

    formatResponseTime(day, title, responseTime): Partial<Stats>{
        return {
            day,
            countBy: CountBy.responseVelocity,
            category: title,
            count: responseTime
        }
    }

    formatResolutionTime(day, title, resolutionTime): Partial<Stats>{
        return {
            day,
            countBy: CountBy.resolutionVelocity,
            category: title,
            count: resolutionTime
        }
    }

    private buildStatsFromCount(day, count: Object, countBy: CountBy) {
        if (Object.keys(count).length === 0) {
            return [];
        }
        return Object.keys(count).reduce((acc, val) => {
            const stat: Partial<Stats> = {
                day,
                countBy,
                category: val,
                count: count[val]
            }
            acc.push(stat);
            return acc;
        }, [])
    }

    getStartEndDates(day) {
        const endDate = this.formatDate(new Date(day));

        const start = new Date(day);
        const previousDay = new Date(start.getTime());
        previousDay.setHours(start.getHours() -24);

        const startDate = this.formatDate(previousDay);

        return {startDate: startDate, endDate: endDate}

    }

}