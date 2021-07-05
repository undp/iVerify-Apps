import { Injectable } from "@nestjs/common";
import { Stats } from "./models/stats.model";

@Injectable()
export class StatsFormatService{
    formatTticketsByAgent(any): Stats[]{
        return [];
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