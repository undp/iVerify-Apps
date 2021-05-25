import { HttpService, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators'

@Injectable()
export class MeedanCheckClientService {
    CHECK_API_URL = 'https://check-api.checkmedia.org/api/graphql';
    CHECK_API_TOKEN = 'cc31334816968ec56d5c3709d574ac94';
    CHECK_API_TEAM = 'undp'
    headers = {
        'Content-Type': 'application/json', 
        'X-Check-Token': `${this.CHECK_API_TOKEN}`,
        'X-Check-Team': `${this.CHECK_API_TEAM}`
    };

    constructor(private http: HttpService){}

  getReport(id: string): Observable<any> {
    const query: string = `query { project_media(ids: \"${id}\") { title description annotation(annotation_type: \"report_design\") { id dbid data } }}`
    return this.http.post(this.CHECK_API_URL, {query}, {headers: this.headers}).pipe(map(res => res.data));
  }
}