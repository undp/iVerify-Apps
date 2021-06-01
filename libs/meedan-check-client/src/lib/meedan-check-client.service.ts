import { HttpService, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators'
import { CheckClientConfig } from './config';

@Injectable()
export class MeedanCheckClientService {    

    constructor(private http: HttpService, private config: CheckClientConfig){}

  getReport(id: string): Observable<any> {
    const query: string = `query { 
      project_media(ids: \"${id}\") { 
        title 
        description 
        annotation(annotation_type: \"report_design\") { 
          id 
          dbid 
          data 
        } 
      }
    }`
    const headers = this.config.headers;
    return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(map(res => res.data.data.project_media));
  }
}