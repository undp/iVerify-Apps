import { HttpException, HttpService, Injectable, Logger } from "@nestjs/common";
import { UnitedwaveClientConfig } from "./config";
import { catchError,concatMap, map, retry , reduce} from 'rxjs/operators';
import { forkJoin } from "rxjs";

@Injectable()
export class UnitedwaveClientService{
    private readonly logger = new Logger('UnitedwaveClient');

    constructor(private http: HttpService, private config: UnitedwaveClientConfig){}

    formatDate(date: Date) {
      // Get date components
      let year = date.getFullYear();
      let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
      let day = String(date.getDate()).padStart(2, '0');

      // Get time components
      let hours = String(date.getHours()).padStart(2, '0');
      let minutes = String(date.getMinutes()).padStart(2, '0');
      let seconds = String(date.getSeconds()).padStart(2, '0');

      // Format the date and time in the desired format
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    getPostsCount(filter?:string) {
      let query = this.config.endpoints.count + `?user[name]=${this.config.username}&user[secret]=${this.config.password}`;
      if(filter) {
        query += `&clip[filters]=${filter}`
      }
      return this.http.post(query).pipe(
          map(res => res.data),
          retry(3),
          catchError(err => {
              this.logger.error(`Error fetching posts: `, err.message);
              throw new HttpException(err.message, 500);
          })
      )
    }

    getPosts(page?: number,startDate?: string){
      this.logger.log('Query United Wave posts page ', page.toString())
      let query = this.config.endpoints.search + `?user[name]=${this.config.username}&user[secret]=${this.config.password}`;
      if (page) {
        query += `&page=${page}`
      }
      if (startDate) {
        query += `&clip[from_date]=${startDate}`
      }
      return this.http.post(query).pipe(
          map(res => res.data),
          retry(3),
          catchError(err => {
              this.logger.error(`Error fetching posts: `, err.message);
              throw new HttpException(err.message, 500);
          })
      )
    }

}


