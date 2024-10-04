import { MlServiceType } from "@iverify/iverify-common";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TriageConfig{
    readonly mlServiceType: string = process.env.ML_SERVICE_TYPE;
    readonly checkRadioTag: string = process.env.CHECK_RADIO_TAG;
    readonly toxicTreshold: number = +process.env.DETOXIFY_TRESHOLD;
    readonly postScanLimit: number = process.env.MAX_POST_SCAN ? +process.env.MAX_POST_SCAN : 2500;
}