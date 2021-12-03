import { Injectable } from "@nestjs/common";

@Injectable()
export class ApiClientConfig{
    readonly apiUrl = process.env.API_URL;
    readonly postArticleUrl = this.apiUrl + 'articles/save-article';

}