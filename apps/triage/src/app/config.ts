import { MlServiceType } from "@iverify/iverify-common";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TriageConfig{
    readonly mlServiceType: string = process.env.ML_SERVICE_TYPE;
    readonly toxicTreshold: number = +process.env.DETOXIFY_TRESHOLD;
}