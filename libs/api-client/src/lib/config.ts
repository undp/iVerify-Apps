import { Injectable } from "@nestjs/common";

@Injectable()
export class ApiClientConfig{
    readonly apiUrl = 'http://localhost:8000';
    readonly postArticleUrl = this.apiUrl + 'articles/save-article';

}