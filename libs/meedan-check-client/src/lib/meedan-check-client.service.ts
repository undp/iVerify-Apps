import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { iif, Observable, of } from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators'
import { CheckClientConfig } from './config';

@Injectable()
export class MeedanCheckClientService {    

    constructor(private http: HttpService, private config: CheckClientConfig){}

  getReport(id: string): Observable<any> {
    const query: string = `query {
      project_media(ids: "${id}"){
        title
        description
        dbid
        media {
          metadata
        }
        annotation(annotation_type: "verification_status") {
          data
        }
        tasks {
          edges {
            node {
              fieldset
              label
              first_response_value
            }
          }
        },
        tags {
          edges {
            node {
              id
              tag_text
            }
          }
        }
      }
    }`
    const headers = this.config.headers;
    return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
      map(res => res.data.data.project_media),
      catchError(err => {
        throw new HttpException(err.message, 500);
      })
      );
  }
}