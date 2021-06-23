import { Injectable } from "@nestjs/common";

@Injectable()
export class TriageConfig{
    readonly toxicTreshold: number = +process.env.DETOXIFY_TRESHOLD;
}