import { HttpException, Injectable } from '@nestjs/common';
import { MlServiceConfig } from './config';
import { catchError, map } from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class MlServiceClientService {
    constructor(private http: HttpService) {}
    analyze(config: MlServiceConfig, messages: string[]) {
        return this.http
            .post(`${config.endpoints.analyze}`, { text: messages })
            .pipe(
                map((res) => res.data[0]),
                catchError((err) => {
                    throw new HttpException(err.message, 500);
                })
            );
    }
}
