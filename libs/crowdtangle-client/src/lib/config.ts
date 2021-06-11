import { Injectable } from "@nestjs/common";

@Injectable()
export class CrowdtangleClientConfig{
    readonly apiBase = process.env.CT_API_URL;

    readonly endpoints = {
        posts: `${this.apiBase}/posts`,
        lists: `${this.apiBase}/lists`
    }

    readonly apiKey = process.env.CT_API_KEY 
    
}
