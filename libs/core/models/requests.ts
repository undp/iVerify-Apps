import { HttpHeaders, HttpParams } from '@angular/common/http';

/**
 * @typedef {{
 *  [param: string]: string | string[] | number
 * }} QueryParams
 */

/**
 *
 *
 * @export
 * @interface QueryParams
 */
export interface QueryParams {
  [param: string]: string | string[] | number;
}

/**
 * @typedef {{
 * headers?: HttpHeaders | {[header: string]: string | string[];};
 * observe?: 'body';
 * params?: HttpParams | {[param: string]: string | string[];};
 * reportProgress?: boolean;
 * responseType?: 'json';
 * withCredentials?: boolean;
 * }} RequestOptions
 */

/**
 * RequestOptions
 *
 * @export
 * @interface RequestOptions
 */
export interface RequestOptions {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  observe?: 'body';
  params?:
    | HttpParams
    | {
        [param: string]: string | string[];
      };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}

/**
 * @typedef {{
 * queryParams?: QueryParams,
 * opt?: APIoptions
 * body?: any
 * }} PrequestOptions
 */

/**
 * PrequestOptions (interface helper)
 *
 * @export
 * @interface PrequestOptions
 */
export interface PrequestOptions {
  queryParams?: QueryParams;
  opt?: APIoptions;
  body?: any;
}

/**
 * @typedef {{
 *  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text',
 *  headers?: any,
 * }} APIoptions
 */

/**
 * Http Body option Interface
 *
 * @export
 * @interface APIoptions
 */
export interface APIoptions {
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
  headers?: any;
}
