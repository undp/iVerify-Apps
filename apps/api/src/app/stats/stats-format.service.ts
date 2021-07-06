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
        return Object.keys(count).reduce((acc, val) => {
            const stat: Partial<Stats> = {
                startDate,
                endDate,
                countBy: CountBy.agent,
                category: val,
                count: count[val]
            }
            acc.push(stat);
            return acc;
        }, [])
    }
    
    formatTticketsByChannel(any): Stats[]{
        return [];
    }

    formatTticketsByTag(any): Stats[]{
        return [];
    }

    formatTticketsByStatus(any): Stats[]{
        return [];
    }

    formatTticketsBySource(any): Stats[]{
        return [];
    }

    formatTticketsByType(any): Stats[]{
        return [];
    }

    formatCreatedVsPublished(any): Stats[]{
        return [];
    }

}