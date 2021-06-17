import { Injectable } from '@nestjs/common';
import { SharedService } from '../shared/shared.service';
import { WpPublisherService } from '../wp-publisher/wp-publisher.service';

@Injectable()
export class AppService {
  constructor(
    private shared: SharedService,
    private wpPublsher: WpPublisherService
    ){}
  
  publishReportById(id: string){
    this.shared.updateReportId(id);
    return this.wpPublsher.post$;
  }
    
}
