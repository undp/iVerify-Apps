import { MlServiceType } from "@iverify/iverify-common";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TriageConfig{
    readonly mlServiceType: string = process.env.ML_SERVICE_TYPE;
    readonly enableRadioMessages: string = process.env.ENABLE_RADIO_MESSAGE || "false";
    readonly originalPostTimeField: string = process.env.ORIGINAL_POST_TIME_FIELD || "Original Reported Date";
    readonly checkRadioTag: string = process.env.CHECK_RADIO_TAG;
    readonly toxicTreshold: number = +process.env.DETOXIFY_TRESHOLD;
    readonly postScanLimit: number = process.env.MAX_POST_SCAN ? +process.env.MAX_POST_SCAN : 2500;
}