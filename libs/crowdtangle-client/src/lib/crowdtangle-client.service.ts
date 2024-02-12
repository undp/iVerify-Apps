import { HttpException, HttpService, Injectable, Logger } from "@nestjs/common";
import { CrowdtangleClientConfig } from "./config";
import { catchError,concatMap, map, retry} from 'rxjs/operators';
import { forkJoin } from "rxjs";

@Injectable()
export class CrowdtangleClientService{
    private readonly logger = new Logger('CrowdTangleClient');

    constructor(private http: HttpService, private config: CrowdtangleClientConfig){}

    getLists(){
      const paramsLists = this.config.apiKey.split(',');
      return forkJoin(
        paramsLists.map(param =>
          this.http.get(`${this.config.endpoints.lists}`, { params: { token: param } }).pipe(
            map(res => res.data.result.lists.map(list => ({ ...list, token: param }))),
           // map(res => res.data.result.lists),
            retry(3),
            catchError(err => {
              this.logger.error(`Error fetching CrowdTangle lists: `, err.message);
              throw new HttpException(err.message, 500);
            })
          )
        )
      ).pipe(
        concatMap(listsArrays => listsArrays) // Flatten the arrays
      );
    }

    getPosts(listIds: string, count: number, offset: number, startDate: string, endDate: string,token?:string){
        const params = {token: token, count, offset, startDate, sortBy: 'date', endDate, listIds};
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
