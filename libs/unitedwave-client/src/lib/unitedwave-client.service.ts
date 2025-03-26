import { HttpException, HttpService, Injectable, Logger } from "@nestjs/common";
import { UnitedwaveClientConfig } from "./config";
import { catchError,concatMap, map, retry , reduce} from 'rxjs/operators';
import { forkJoin } from "rxjs";

type TimeSlot = { time: string; radio: string };
type Schedule = { [day: string]: TimeSlot[] };
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

    private replaceSpaces(str:String) {
      return str.replace(/ /g, '%20');
    }

    getPostsCount(startDate?: string,filter?:string) {
      let query = this.config.endpoints.count + `?user[name]=${this.config.username}&user[secret]=${this.config.password}`;
      if(filter) {
        query += `&clip[filters]=${filter}`
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

    // Helper to parse HH:MM into Date object
    getTimeRange(baseDate: Date, time: string): [Date, Date] {
      const [hour, minute] = time.split(':').map(Number);
      const start = new Date(baseDate);
      start.setHours(hour, minute, 0, 0);
      const end = new Date(start);
      end.setHours(end.getHours() + 1);
      return [start, end];
    }

    filterClipsByTime(clips: any[], schedule: Schedule) {
      return clips.filter(clip => {
        const reportedDate = new Date(clip.date_reported);
        const dayName = reportedDate.toLocaleDateString("en-US", { weekday: "long" });

        const slots = schedule[dayName];
        if (!slots) return false;

        return slots.some(({ time, radio }) => {
          const [start, end] = this.getTimeRange(reportedDate, time);
          return reportedDate >= start && reportedDate < end && radio == clip.radio_name;
        });
      });
    }

    async getPosts(page?: number,startDate?: string){
      const radios = ['Top Congo FM', 'HK6', 'MALAIKA', 'RADIO OKAPI']

      const schedule: Schedule = {
        Monday: [
          { time: "10:30", radio: "Top Congo FM" },
          { time: "08:30", radio: "Top Congo FM" },
          { time: "18:00", radio: "RADIO OKAPI" }
        ],
        Tuesday: [
          { time: "10:30", radio: "Top Congo FM" },
          { time: "08:30", radio: "Top Congo FM" },
          { time: "17:30", radio: "Top Congo FM" },
          { time: "18:00", radio: "RADIO OKAPI" }
        ],
        Wednesday: [
          { time: "10:30", radio: "Top Congo FM" },
          { time: "08:30", radio: "Top Congo FM" },
          { time: "18:00", radio: "RADIO OKAPI" }
        ],
        Thursday: [
          { time: "10:30", radio: "Top Congo FM" },
          { time: "08:30", radio: "Top Congo FM" },
          { time: "17:15", radio: "HK6" },
          { time: "18:00", radio: "RADIO OKAPI" }
        ],
        Friday: [
          { time: "10:30", radio: "Top Congo FM" },
          { time: "08:30", radio: "Top Congo FM" },
          { time: "18:00", radio: "RADIO OKAPI" }
        ],
        Saturday: [
          { time: "08:30", radio: "Top Congo FM" },
          { time: "18:00", radio: "Top Congo FM" },
          { time: "18:00", radio: "RADIO OKAPI" }
        ],
        Sunday: [
          { time: "08:30", radio: "Top Congo FM" }
        ]
      };
      this.logger.log('Query United Wave posts page ', page.toString())
      let query = this.config.endpoints.search + `?user[name]=${this.config.username}&user[secret]=${this.config.password}`;
      if (page) {
        query += `&page=${page}`
      }
      if (startDate) {
        query += `&clip[from_date]=${startDate}`
      }
      if (radios.length>0) {
          radios.forEach(radio => {
            query += `&clip[radio_name][]=${radio}`
          });
      }

      const finalQuery = this.replaceSpaces(query);

      
      const posts = await this.http.post(finalQuery).pipe(
          map(res => res.data),
          retry(3),
          catchError(err => {
              this.logger.error(`Error fetching posts: `, err.message);
              throw new HttpException(err.message, 500);
          })
      ).toPromise()

      const filteredClips = this.filterClipsByTime(posts, schedule);
      this.logger.log(`Size before filtering ${posts.length} size after filtering ${filteredClips.length}`)
      return filteredClips;
    }

}


