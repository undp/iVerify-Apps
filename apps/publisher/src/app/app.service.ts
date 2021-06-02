import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SharedService } from './services/shared.service';
import { WpPublisherService } from './services/wp-publisher.service';

@Injectable()
export class AppService {
  constructor(
    private shared: SharedService,
    private wpPublsher: WpPublisherService
    ){}
  
  publishReportById(id: string): Observable<any>{
    this.shared.updateReportId(id);
    return this.wpPublsher.post$;
  }
    
}
