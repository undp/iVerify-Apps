import { Injectable } from "@nestjs/common";

@Injectable()
export class CheckClientConfig{
    readonly checkApiUrl = process.env.CHECK_API_URL;
    readonly checkApiToken = process.env.CHECK_API_TOKEN;
    readonly checkApiTeam = process.env.CHECK_API_TEAM;
    readonly headers = {
        'Content-Type': 'application/json', 
        'X-Check-Token': `${this.checkApiToken}`,
        'X-Check-Team': `${this.checkApiTeam}`,
        'Cache-Control': 'no-cache'
    };
    readonly uploadFolderId = process.env.CHECK_FOLDER_ID;

}