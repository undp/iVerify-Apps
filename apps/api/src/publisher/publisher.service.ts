import { Injectable, Logger } from '@nestjs/common';
import { combineLatest, Observable } from 'rxjs';
import { ApiPublisherService } from './api-publisher/api-publisher.service';
import { SharedService } from './shared/shared.service';
import { WpPublisherService } from './wp-publisher/wp-publisher.service';

@Injectable()
export class PublisherService {
    private readonly logger = new Logger(PublisherService.name);

    itemsToBePublished$: Observable<any> = combineLatest([
        this.wpPublsher.post$,
        this.apiPublisher.postToApi$,
    ]);

    constructor(
        private shared: SharedService,
        private wpPublsher: WpPublisherService,
        private apiPublisher: ApiPublisherService
    ) {}

    publishReportById(id: string) {
        this.shared.updateReportId(id);
        return this.itemsToBePublished$;
    }
}
