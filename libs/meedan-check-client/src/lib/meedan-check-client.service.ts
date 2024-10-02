import { HttpException, HttpService, Injectable, Logger } from '@nestjs/common';
import { forkJoin, iif, Observable, of } from 'rxjs';
import { catchError, map, retry, switchMap, tap } from 'rxjs/operators';
import { CheckClientConfig } from './config';
import { CheckClientHelperService } from './helper.service';
import { ToxicityScores } from './interfaces/toxicity-scores';

@Injectable()
export class MeedanCheckClientService {
  private readonly logger = new Logger('MeedanCheckClient');

  constructor(
    private http: HttpService,
    private config: CheckClientConfig,
    private helper: CheckClientHelperService
  ) {}

  getReport(id: string): Observable<any> {
    const query: string = this.helper.buildGetReportQuery(id);
    const headers = this.config.headers;
    console.log('Getting report query: ', query);
    return this.http.post(this.config.checkApiUrl, { query }, { headers }).pipe(
      tap((res) =>
        console.log('Getting report res: ', JSON.stringify(res.data))
      ),
      map((res) => res.data.data.project_media),
      retry(3),
      catchError((err) => {
        this.logger.error('Error getting report by id: ', err.message);
        throw new HttpException(err.message, 500);
      })
    );
  }

  getMeedanReport(id: string): Observable<any> {
    const query: string = this.helper.buildGetMeedanReportQuery(id);
    const headers = this.config.headers;
    console.log('Getting meedan report query: ', query);
    return this.http.post(this.config.checkApiUrl, { query }, { headers }).pipe(
      tap((res) =>
        console.log('Getting meedan report res: ', JSON.stringify(res.data))
      ),
      map((res) =>
        res.data.data.project_media.annotation.data.options[0]
          ? res.data.data.project_media.annotation.data.options[0]
          : res.data.data.project_media.annotation.data.options
      ),
      retry(3),
      catchError((err) => {
        this.logger.error('Error getting meedan report by id: ', err.message);
        console.log(query);
        console.log(err);
        throw new HttpException(err.message, 500);
      })
    );
  }

  getReportWithQuery(query: string): Observable<any> {
    const headers = this.config.headers;
    return this.http.post(this.config.checkApiUrl, { query }, { headers }).pipe(
      map((res) => res.data.data.project_media),
      retry(3),
      catchError((err) => {
        this.logger.error('Error getting report by id: ', err.message);
        throw new HttpException(err.message, 500);
      })
    );
  }

  createItem(url: string, toxicityScores: ToxicityScores): Observable<any> {
    const folderId: number = +this.config.uploadFolderId;
    const set_tasks_responses: string = this.helper.buildTasksResponses(
      toxicityScores
    );
    const query: string = this.helper.buildCreateItemMutation(
      url,
      folderId,
      set_tasks_responses,
      [this.config.checkCTTag]
    );
    const headers = this.config.headers;
    return this.http.post(this.config.checkApiUrl, { query }, { headers }).pipe(
      map((res) => res.data),
      retry(3),
      catchError((err) => {
        this.logger.error('Error creating item: ', err.message);
        return of({ error: err.message, url });
        // throw new HttpException(err.message, 500);
      })
    );
  }

  createItemFromWp(
    url: string,
    content: string,
    files?: string[],
    email?: string,
    wp_key = 'message_from_website'
  ): Observable<any> {
    const query: string = this.helper.buildCreateItemFromWPMutation(
      url,
      content,
      wp_key,
      [this.config.checkWebTag]
    );
    const headers = this.config.headers;
    const isWpNewDesignOrNot = process.env.IS_WP_NEW_DESIGN ?? false;

    const createMediaResponse = this.postData(query, headers);

    if (!isWpNewDesignOrNot) {
      return this.handleResponse(createMediaResponse);
    }

    return createMediaResponse.pipe(
      switchMap((response) =>
        {
          // Log the data to check if it has the expected structure
          console.log('Response data from createMediaResponse:', response.data);

          // Proceed with processing additional requests
          return this.processAdditionalRequests(response.data, email, files, headers);
      }
      )
    );
  }

  private processAdditionalRequests(
    data: any,
    email: string | undefined,
    files: string[] | undefined,
    headers: any
  ): Observable<any> {
    console.log('createMediaResponse', data.createProjectMedia);
    const annotationList = data.createProjectMedia.project_media.tasks.edges;

    const emailRequest = email
      ? this.handleEmail(email, annotationList, headers)
      : of(null);
    const filesRequest =
      files && files.length > 0
        ? this.handleFiles(files, annotationList, headers)
        : of(null);

    return forkJoin([emailRequest, filesRequest]).pipe(
      map(([emailResponse, filesResponse]) => ({
        emailResponse,
        filesResponse,
      })),
      catchError((err) => {
        this.logger.error('Error processing items: ', err.message);
        return of({ error: err.message });
      })
    );
  }

  private getAnnotationId(annotationList: any[], label: string): string {
    return annotationList
      .filter((edge) => edge.node.label === label)
      .map((edge) => edge.node.id)
      .filter((id) => id)
      .pop();
  }

  private buildUpdateItemQuery(annotationList: any[], files?: string[]): any {
    const updateItemQuery = [];

    if (files) {
      for (let count = 1; count <= files.length; count++) {
        const id = this.getAnnotationId(annotationList, `Upload ${count}`);
        updateItemQuery.push({
          id: id,
          value: files[count - 1],
          type: 'task_response_free_text',
          set_field: 'response_free_text',
        });
      }
    }

    return updateItemQuery;
  }

  private handleEmail(
    email: string,
    annotationList: any[],
    headers: any
  ): Observable<any> {
    const emailAnnotationId = this.getAnnotationId(
      annotationList,
      'Email Address'
    );
    const combinedQuery = this.helper.buildAnnotationItemsCombinedFromWpMutation(
      emailAnnotationId,
      'task_response_free_text',
      'response_free_text',
      email
    );

    return this.postData(combinedQuery, headers);
  }

  private handleFiles(
    files: string[],
    annotationList: any[],
    headers: any
  ): Observable<any> {
    const filesList = this.buildUpdateItemQuery(annotationList, files);
    console.log('handleFile', filesList);
    const requests = filesList.map((file) => {
      const combinedQuery = this.helper.buildAnnotationItemsCombinedFromWpMutation(
        file.id,
        file.type,
        file.set_field,
        file.value
      );
      return this.postData(combinedQuery, headers);
    });

    return forkJoin(requests);
  }

  private postData(query: string, headers: any): Observable<any> {
    return this.http.post(this.config.checkApiUrl, { query }, { headers }).pipe(
      map((res) => res.data),
      retry(3),
      catchError((err) => {
        this.logger.error('Error creating item: ', err.message);
        return of({ error: err.message });
      })
    );
  }

  private handleResponse(response$: Observable<any>): Observable<any> {
    return response$.pipe(
      tap((data) => {
        console.log('createItemFromWp response data:', data);
      })
    );
  }
}
