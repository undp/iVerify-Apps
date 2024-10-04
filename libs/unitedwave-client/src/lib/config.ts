import { Injectable } from "@nestjs/common";

@Injectable()
export class UnitedwaveClientConfig{
    readonly apiBase = process.env.UW_API_URL || 'https://d33sfn9oexgx8n.cloudfront.net/undp';

    readonly username = process.env.UW_USERNAME;
    readonly password = process.env.UW_PASSWORD;

    readonly endpoints = {
        search: `${this.apiBase}/search`,
    }

    
}
