import { Injectable } from "@nestjs/common";

@Injectable()
export class CheckClientConfig{
    readonly checkApiUrl = process.env.CHECK_API_URL;
    readonly checkApiToken = process.env.CHECK_API_TOKEN;
    readonly checkApiTeam = process.env.CHECK_API_TEAM;
    readonly checkPublishFolder = process.env.WP_PUBLISHED_FOLDER;
    readonly checkCTTag = process.env.CHECK_CT_TAG || "1 c - From CrowdTangle";
    readonly checkWebTag = process.env.CHECK_WEB_TAG || "1 d - From the website";
    readonly headers = {
        'Content-Type': 'application/json', 
        'X-Check-Token': `${this.checkApiToken}`,
        'X-Check-Team': `${this.checkApiTeam}`,
        'Cache-Control': 'no-cache'
    };
    readonly uploadFolderId = process.env.CHECK_FOLDER_ID;

}