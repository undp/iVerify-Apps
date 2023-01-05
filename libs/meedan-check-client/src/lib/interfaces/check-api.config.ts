/* eslint-disable @typescript-eslint/ban-ts-comment */
import { AxiosRequestHeaders } from 'axios';

// @ts-ignore
export interface CheckApiConfigHeaders extends AxiosRequestHeaders {
    'Content-Type': string;
    'X-Check-Token': string;
    'X-Check-Team': string;
    'Cache-Control': string;
    locationId: string;
}

export interface CheckApiConfig {
    checkApiUrl: string;
    checkApiToken: string;
    checkApiTeam: string;
    checkPublishFolder: string | number;
    headers: CheckApiConfigHeaders;
    uploadFolderId: string | number;
    lang: string;
}
