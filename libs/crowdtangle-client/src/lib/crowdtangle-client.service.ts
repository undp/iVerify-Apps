import { HttpException, HttpService, Injectable, Logger } from "@nestjs/common";
import { CrowdtangleClientConfig } from "./config";
import { catchError, map, retry, tap } from 'rxjs/operators';

@Injectable()
export class CrowdtangleClientService{
    private readonly logger = new Logger('CrowdTangleClient');

    constructor(private http: HttpService, private config: CrowdtangleClientConfig){}

    getLists(){
        const params = {token: this.config.apiKey};
        return this.http.get(`${this.config.endpoints.lists}`, {params}).pipe(
            map(res => res.data.result.lists),
            retry(3),
            catchError(err => {
                this.logger.error(`Error fetching CrowdTangle lists: `, err.message);
                throw new HttpException(err.message, 500);
            })
        ) 
    }

    getPosts(listIds: string, count: number, offset: number, startDate: string, endDate: string){
        const params = {token: this.config.apiKey, count, offset, startDate, sortBy: 'date', endDate, listIds};
        return this.http.get(`${this.config.endpoints.posts}`, {params}).pipe(           
            map(res => res.data.result),
            retry(3),
            catchError(err => {
                this.logger.error(`Error fetching posts: `, err.message);
                throw new HttpException(err.message, 500);
            })
        )

    }

}