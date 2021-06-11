import { Injectable } from "@nestjs/common";

@Injectable()
export class MlServiceConfig{
    readonly apiBase = process.env.ML_SERVICE_API_BASE;

    readonly endpoints = {
        analyze: `${this.apiBase}/analyze`
    }
}
