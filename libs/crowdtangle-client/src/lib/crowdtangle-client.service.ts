import { HttpException, HttpService, Injectable } from "@nestjs/common";
import { CrowdtangleClientConfig } from "./config";
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class CrowdtangleClientService{
    constructor(private http: HttpService, private config: CrowdtangleClientConfig){}
    getLists(){
        const params = {token: this.config.apiKey};
        return this.http.get(`${this.config.endpoints.lists}`, {params}).pipe(
            map(res => res.data.result.lists),
            catchError(err => {
                console.log(err)
                throw new HttpException(err.message, 500);
            })
        ) 
    }

    getPosts(listId: string, offset: number){
        const params = {token: this.config.apiKey, listIds: listId, count: 5, offset};
        return this.http.get(`${this.config.endpoints.posts}`, {params}).pipe(
            map(res => res.data.result),
            catchError(err => {
                throw new HttpException(err.message, 500);
            })
        )

    }

}