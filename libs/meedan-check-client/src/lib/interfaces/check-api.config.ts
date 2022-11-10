import { AxiosRequestHeaders } from 'axios';

export interface CheckApiConfigHeaders extends AxiosRequestHeaders {
    'Content-Type': string;
    'X-Check-Token': string;
    'X-Check-Team': string;
    'Cache-Control': string;
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
