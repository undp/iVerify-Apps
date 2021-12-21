import { Injectable } from "@nestjs/common";

@Injectable()
export class PerspectiveConfig{
    readonly apiBase = process.env.PERSPECTIVE_API_BASE;
    readonly apiKey = process.env.PERSPECTIVE_API_KEY;
    readonly analyzeEndpoint = '/v1alpha1/comments:analyze';


    readonly endpoints = {
        analyze: `${this.apiBase}/${this.analyzeEndpoint}?key=${this.apiKey}`
    }
}
