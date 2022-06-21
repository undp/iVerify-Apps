import { HttpException, HttpService, Injectable } from "@nestjs/common";
import { catchError, delay, map, retryWhen, take, tap } from 'rxjs/operators';
import { PerspectiveConfig } from "./config";

@Injectable()
export class PerspectiveClientService{
    constructor(private http: HttpService, private config: PerspectiveConfig){}
    analyze(messages: string, threshold: number){
        const body = this.buildAnalyzeBody(messages, threshold);
        console.log('--Perspective end point');
        console.log(this.config.endpoints.analyze);
        console.log('--Perspective request body');
        console.log(body);
        return this.http.post(`${this.config.endpoints.analyze}`, body).pipe(
            retryWhen(errors => errors.pipe(tap(e => console.log('error..', e)), delay(3000), take(10))), //perspective limits to 1 call per second; in case of error this will retry 3 times with a delay of 1.5 seconds
            map(res => res.data),
            tap(data => console.log('perspective result: ', data)),
            map(data => this.convertResults(data)),
            catchError(err => {
                throw new HttpException(err.message, 500)
            })
        )
    }

    private buildAnalyzeBody(message: string, threshold: number){
        const body = {
            comment:
            {
              text: message},
              languages: ['en'],
              requestedAttributes: {
                    TOXICITY:{scoreThreshold: threshold},
                    SEVERE_TOXICITY: {scoreThreshold: threshold},
                    IDENTITY_ATTACK: {scoreThreshold: threshold},
                    INSULT: {scoreThreshold: threshold},
                    THREAT: {scoreThreshold: threshold},
                    SEXUALLY_EXPLICIT: {scoreThreshold: threshold},
                    PROFANITY: {scoreThreshold: threshold}
                } 
           }
        return body;
    }

    private convertResults(result: any){
        if (!result['attributeScores']) return {};
        if (!result) return {};
        const scores = result.attributeScores;
        const toxicity = scores['TOXICITY'] ? scores['TOXICITY'].summaryScore.value : 0;
        const severe_toxicity = scores['SEVERE_TOXICITY'] ? scores['SEVERE_TOXICITY'].summaryScore.value : 0;
        const obscene = scores['PROFANITY'] ? scores['PROFANITY'].summaryScore.value : 0;
        const threat = scores['THREAT'] ? scores['THREAT'].summaryScore.value : 0;
        const insult = scores['INSULT'] ? scores['INSULT'].summaryScore.value : 0;
        const identity_attack = scores['IDENTITY_ATTACK'] ? scores['IDENTITY_ATTACK'].summaryScore.value : 0;
        const sexual_explicit = scores['SEXUALLY_EXPLICIT'] ? scores['SEXUALLY_EXPLICIT'].summaryScore.value : 0;
        return {
            toxicity,
            severe_toxicity,
            obscene,
            threat,
            insult,
            identity_attack,
            sexual_explicit
        }
    }

    //Example Perspective response. If all values are below the threshold then attributeScores is absent.
    // {
    //     "attributeScores": {
    //       "SEVERE_TOXICITY": {
    //         "spanScores": [
    //           {
    //             "begin": 0,
    //             "end": 14,
    //             "score": {
    //               "value": 0.024356365,
    //               "type": "PROBABILITY"
    //             }
    //           }
    //         ],
    //         "summaryScore": {
    //           "value": 0.024356365,
    //           "type": "PROBABILITY"
    //         }
    //       },
    //       "SEXUALLY_EXPLICIT": {
    //         "spanScores": [
    //           {
    //             "begin": 0,
    //             "end": 14,
    //             "score": {
    //               "value": 0.068958156,
    //               "type": "PROBABILITY"
    //             }
    //           }
    //         ],
    //         "summaryScore": {
    //           "value": 0.068958156,
    //           "type": "PROBABILITY"
    //         }
    //       },
    //       "THREAT": {
    //         "spanScores": [
    //           {
    //             "begin": 0,
    //             "end": 14,
    //             "score": {
    //               "value": 0.07613463,
    //               "type": "PROBABILITY"
    //             }
    //           }
    //         ],
    //         "summaryScore": {
    //           "value": 0.07613463,
    //           "type": "PROBABILITY"
    //         }
    //       },
    //       "TOXICITY": {
    //         "spanScores": [
    //           {
    //             "begin": 0,
    //             "end": 14,
    //             "score": {
    //               "value": 0.06207703,
    //               "type": "PROBABILITY"
    //             }
    //           }
    //         ],
    //         "summaryScore": {
    //           "value": 0.06207703,
    //           "type": "PROBABILITY"
    //         }
    //       },
    //       "INSULT": {
    //         "spanScores": [
    //           {
    //             "begin": 0,
    //             "end": 14,
    //             "score": {
    //               "value": 0.03121249,
    //               "type": "PROBABILITY"
    //             }
    //           }
    //         ],
    //         "summaryScore": {
    //           "value": 0.03121249,
    //           "type": "PROBABILITY"
    //         }
    //       },
    //       "IDENTITY_ATTACK": {
    //         "spanScores": [
    //           {
    //             "begin": 0,
    //             "end": 14,
    //             "score": {
    //               "value": 0.037866853,
    //               "type": "PROBABILITY"
    //             }
    //           }
    //         ],
    //         "summaryScore": {
    //           "value": 0.037866853,
    //           "type": "PROBABILITY"
    //         }
    //       }
    //     },
    //     "languages": [
    //       "en"
    //     ],
    //     "detectedLanguages": [
    //       "es"
    //     ]
    //   }



    
}