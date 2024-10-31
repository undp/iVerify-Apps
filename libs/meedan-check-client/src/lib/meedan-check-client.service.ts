import { HttpException, HttpService, Injectable, Logger } from '@nestjs/common';
import { forkJoin, from, iif, Observable, of } from 'rxjs';
import { catchError, map, retry, switchMap, tap } from 'rxjs/operators';
import { CheckClientConfig } from './config';
import { CheckClientHelperService } from './helper.service';
import { ToxicityScores } from './interfaces/toxicity-scores';
import { S3Service } from 'libs/s3/src/lib/s3.service';
import { v4 as uuidv4 } from 'uuid';
import { TasksLabels } from '@iverify/common/src';
@Injectable()
export class MeedanCheckClientService {
  private readonly logger = new Logger('MeedanCheckClient');
  lang = process.env.language;
  constructor(
    private http: HttpService,
    private config: CheckClientConfig,
    private helper: CheckClientHelperService,
    private s3Service: S3Service
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

  getLatestMeedanReport(tag: string) {
    const headers = this.config.headers;
    const query = this.helper.buildGetLatestFromTagQuery(tag);
    return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
      map(res => res.data),
      retry(3),
      catchError(err => {
        this.logger.error('Error getting report by id: ', err.message)
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
    files?: any,
    email?: string,
    wp_key = 'message_from_website'
  ): any {
    const query: string = this.helper.buildCreateItemFromWPMutation(
      url,
      content,
      wp_key,
      [this.config.checkWebTag]
    );
    const headers = this.config.headers;
    const isWpNewDesignOrNot = process.env.IS_WP_NEW_DESIGN ?? false;

    // Send the initial post request
    const createMediaResponse = this.postData(query, headers);

    // If the WP design is not new, return the response directly
    if (!isWpNewDesignOrNot) {
      return  createMediaResponse;
    }

    // Process response and additional requests if WP design is new
    return createMediaResponse.pipe(
      switchMap((response) => {
        // Check if the response contains an error before proceeding
        if (response.error) {
          this.logger.error('Error in createMediaResponse:', response.error);
          return of({ error: response.error , statusCode: 400});
        }

        // Log the data structure to check if it's as expected
        console.log('Response data from createMediaResponse:', response.data.data);

        // Ensure the response data is in the expected structure
        if (!response?.data?.data || !response?.data?.data.createProjectMedia) {
          this.logger.error('Unexpected response structure:', response?.data);
          return of({ error: 'Unexpected response structure' , statusCode: 400});
        }

        // Process additional requests for email and files
        return this.processAdditionalRequests(response?.data?.data, email, files, headers);
      }),
      catchError((err) => {
        // Catch and log any errors during the request processing
        this.logger.error('Error in createItemFromWp:', err.message);
        return of({ error: err.message, statusCode: 500 });
      })
    );
  }

  private processAdditionalRequests(
    data: any,
    email: string | undefined,
    files: any | undefined,
    headers: any
  ): Observable<any> {
    console.log('createMediaResponse', data.createProjectMedia);
    const annotationList = data.createProjectMedia.project_media.tasks.edges;

    const emailRequest = email && email.trim() !== '' && this.isValidEmail(email)
    ? this.handleEmail(email, annotationList, headers)  // Proceed with email handling
    : of(null)
    const filesRequest = files && files.length > 0
    ? from(this.handleFiles(files, headers, annotationList)) // Convert Promise to Observable
    : of(null);

    return forkJoin([emailRequest, filesRequest]).pipe(
      map(([emailResponse, filesResponse]) => ({
        emailResponse,
        filesResponse,
        statusCode: 201
      })),
      catchError((err) => {
        this.logger.error('Error processing items: ', err.message);
        return of({ error: err.message, statusCode: 400 });
      })
    );
  }

  private getAnnotationId(annotationList: any[], label: string): string {
 //   console.log('getAnnotationId', annotationList)
    return annotationList
      .filter((edge) => edge.node.label === label)
      .map((edge) => edge.node.id)
      .filter((id) => id)
      .pop();
  }

  private async buildUpdateItemQuery(annotationList?: any[], files?: any): Promise<any> {
    const updateItemQuery = [];

    if (files) {
      const bucketName:string = process.env.AWS_BUCKET_NAME ?? 'iverify-prod-cd-web'
      const id = this.getAnnotationId(annotationList, `${TasksLabels[this.lang].upload_file}`);
      let url_format = '';
      for (let count = 1; count <= files.length; count++) {
        // Upload the current file to the bucket and get the file URL
        const url: any = await this.uploadFile(bucketName, files[count - 1]);

        // Concatenate the file URL to url_format
        // For all but the last file, add a comma and a space
        if (count < files.length) {
          url_format += url.fileUrl + ', ';
        } else {
          url_format += url.fileUrl; // For the last file, don't add a comma
        }
      }
      updateItemQuery.push({
        id: id,
        value: url_format,
        type: 'task_response_free_text',
        set_field: 'response_free_text',
      });
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
      TasksLabels[this.lang].email_address
    );
    const combinedQuery = this.helper.buildAnnotationItemsCombinedFromWpMutation(
      emailAnnotationId,
      'task_response_free_text',
      'response_free_text',
      email
    );

    return this.postData(combinedQuery, headers);
  }

   UpdateRadioCategory(
    category: string,
    annotationList?: any[],
  ): Observable<any> {
    const headers = this.config.headers;
    const categoryId = this.getAnnotationId(
      annotationList,
      TasksLabels[this.lang].meedan_category
    );
    console.log('UpdateRadioCategory',categoryId,category)
    const combinedQuery = this.helper.buildAnnotationItemsCombinedFromWpMutation(
      categoryId,
      'task_response_single_choice',
      'response_single_choice',
      category
    );

    return this.postData(combinedQuery, headers);
  }

  private async handleFiles(
    files: string[],
    headers: any,
    annotationList?: any[],
  ): Promise<any> {
    const filesList = await this.buildUpdateItemQuery(annotationList, files);
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

    return forkJoin(requests).toPromise();
  }

  private postData(query: string, headers: any): Observable<any> {
    return this.http.post(this.config.checkApiUrl, { query }, { headers }).pipe(
      map((res) => ({
        data: res.data,
        statusCode: 201
      })),
      retry(3),
      catchError((err) => {
        this.logger.error('Error creating item: ', err.message);
        return of({ error: err.message, "statusCode":400 });
      })
    );
  }


  createItemFromRadio(url: string, name: string, content: string, created_date: string): Observable<any>{
    const query: string = this.helper.buildCreateItemFromRadioMessage(url, name, content, created_date);
    const headers = this.config.headers;

    return this.http.post(this.config.checkApiUrl, {query}, {headers}).pipe(
      map(res => res.data),
      retry(3),
      catchError(err => {
        this.logger.error('Error creating item: ', err.message);
        return of({error: err.message})
        // throw new HttpException(err.message, 500);
      })
    )
  }

  async uploadFile(bucketName: string, file) {
    const { originalname, buffer } = file;
    const sanitizedOriginalname = originalname.replace(/\s+/g, '');
    const fileKey = `${uuidv4()}-${sanitizedOriginalname}`;
    const fileUrl = await this.s3Service.uploadFile(bucketName,buffer, file.mimetype,fileKey);
    return { fileUrl };
  }

  private isValidEmail(email: string): boolean {
    // Regular expression to validate basic email pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);  // Returns true if email is valid, false otherwise
  }
}
