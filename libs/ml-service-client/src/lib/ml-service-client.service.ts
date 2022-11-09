import { HttpException, Injectable } from '@nestjs/common';
import { MlServiceConfig } from './config';
import { catchError, map } from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class MlServiceClientService {
    constructor(private http: HttpService, private config: MlServiceConfig) {}
    analyze(messages: string[]) {
        return this.http
            .post(`${this.config.endpoints.analyze}`, { text: messages })
            .pipe(
                map((res) => res.data[0]),
                catchError((err) => {
                    throw new HttpException(err.message, 500);
                })
            );
    }
}
