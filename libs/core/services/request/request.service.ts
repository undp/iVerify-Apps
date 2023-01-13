import {
    HttpClient,
    HttpHeaders,
    HttpParams,
    HttpUrlEncodingCodec,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { APIoptions, QueryParams, RequestOptions } from '../../models/requests';

@Injectable({
    providedIn: 'root',
})
export class RequestService {
    public tenant: string;

    /**
     * Creates an instance of RequestService.
     *
     * @param {HttpClient} httpClient
     * @memberof RequestService
     * @example
     * Todo test if a new HttpParams() is necessary
     * console.log(this.getRequestOptions())
     * console.log(this.getRequestOptions({ page: 1, pageSize: 10 }))
     * console.log(this.getRequestOptions({ page: 1, pageSize: 10}, { headers: { 'Content-Type': 'MrT is king on tha praceta'} }))
     * console.log(this.getRequestOptions({ page: 1, pageSize: 10}, { responseType: 'blob' }))
     * console.log(this.getRequestOptions({}, { responseType: 'blob', headers: { 'Content-Type': 'MrT is king on tha praceta'} }));
     * console.log(this.getRequestOptions({ page: 1, pageSize: 10}, { responseType: 'blob', headers: { 'Content-Type': 'MrT is king on tha praceta'} }));
     */

    public constructor(private httpClient: HttpClient) {
        this.tenant = location.hostname.split('.')[0];
    }

    /**
     * Method to get Short Token from LocalStorage
     *
     * @return {*}  {string}
     * @memberof RequestService
     * @description responsable to get local-storage with the key : value
     */

    // public getShortToken(): string {
    //   return JSON.parse(localStorage.getItem('access_token'));
    // }

    /**
     * Build Custom HttpHeader if needed
     *
     * @param headers
     * @description responsable do construct headers default or customize with token itself
     */

    private headersBuilder(
        headers?: HttpHeaders | { [header: string]: string | string[] }
    ) {
        let headerOptionsDefault = {};
        headerOptionsDefault = {
            'Content-Type': 'application/json',
        };

        if (headers) {
            headerOptionsDefault = { ...headerOptionsDefault, ...headers };
        }

        // if (this.getShortToken()) {
        //   headerOptionsDefault = {
        //     ...headerOptionsDefault,
        //     Authorization: 'Bearer ' + this.getShortToken()
        //   };
        // }

        return headerOptionsDefault;
    }

    /**
     * Method to build custom RequestOptions
     *
     * @private
     * @param {*} [queryParams]
     * @param {APIoptions} [apiOptions]
     * @return {*}  {RequestOptions}
     * @memberof RequestService
     * @description responsable do give to http request possible queryParams or other options {}
     */

    private getRequestOptions(
        queryParams?: QueryParams,
        apiOptions?: APIoptions
    ): RequestOptions {
        const encoder = new HttpUrlEncodingCodec();

        let options = {};

        options = {
            ...options,
            responseType:
                apiOptions && 'responseType' in apiOptions
                    ? apiOptions.responseType
                    : 'json',
        };

        let params = new HttpParams();

        if (queryParams !== undefined && queryParams !== null) {
            for (const key of Object.keys(queryParams)) {
                const value: string | string[] | number = queryParams[key];
                if (queryParams[key]) {
                    params = params.set(
                        key,
                        encoder.encodeValue(value.toString())
                    );
                }
            }
            options = {
                ...options,
                params: params,
            };
        }

        return {
            ...options,
            headers:
                apiOptions && 'headers' in apiOptions
                    ? this.headersBuilder(apiOptions.headers)
                    : this.headersBuilder(),
        };
    }

    /**
     *  GET
     *
     * @template T
     * @param {string} url
     * @param {(QueryParams)} [queryParams]
     * @param {APIoptions} [opt]
     * @return {*}  {Observable<T>}
     * @memberof RequestService
     */

    public get<T>(
        url: string,
        queryParams?: QueryParams,
        opt?: APIoptions
    ): Observable<T> {
        const options = this.getRequestOptions(queryParams, opt);
        return this.httpClient.get<T>(url, options);
    }

    /**
     *  POST
     *
     * @template T
     * @param {string} url
     * @param {*} [body]
     * @param {(QueryParams)} [queryParams]
     * @param {APIoptions} [opt]
     * @return {*}  {Observable<T>}
     * @memberof RequestService
     */

    public post<T>(
        url: string,
        body?: any,
        queryParams?: QueryParams,
        opt?: APIoptions
    ): Observable<T> {
        const options = this.getRequestOptions(queryParams, opt);
        return this.httpClient.post<T>(url, body, options);
    }

    /**
     * PUT
     *
     * @template T
     * @param {string} url
     * @param {*} [body]
     * @param {(QueryParams)} [queryParams]
     * @param {APIoptions} [opt]
     * @return {*}  {Observable<T>}
     * @memberof RequestService
     */

    public put<T>(
        url: string,
        body?: any,
        queryParams?: QueryParams,
        opt?: APIoptions
    ): Observable<T> {
        const options = this.getRequestOptions(queryParams, opt);
        return this.httpClient.put<T>(url, body, options);
    }

    /**
     * PATCH
     *
     * @template T
     * @param {string} url
     * @param {*} [body]
     * @param {(QueryParams)} [queryParams]
     * @param {APIoptions} [opt]
     * @return {*}  {Observable<T>}
     * @memberof RequestService
     */

    public patch<T>(
        url: string,
        body?: any,
        queryParams?: QueryParams,
        opt?: APIoptions
    ): Observable<T> {
        const options = this.getRequestOptions(queryParams, opt);
        return this.httpClient.patch<T>(url, body, options);
    }

    /**
     * DELETE
     *
     * @template T
     * @param {string} url
     * @param {(QueryParams)} [queryParams]
     * @param {APIoptions} [opt]
     * @return {*}  {Observable<T>}
     * @memberof RequestService
     */

    public delete<T>(
        url: string,
        queryParams?: QueryParams,
        opt?: APIoptions
    ): Observable<T> {
        const options = this.getRequestOptions(queryParams, opt);
        return this.httpClient.delete<T>(url, options);
    }
}
