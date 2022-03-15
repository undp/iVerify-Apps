import { Injectable } from '@angular/core';
import { BaseService } from '../../core/base/base-service';
import { Tickets } from '../../core/models/dashboard';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService {
  readonly uris = {
    create: 'posts',
    ticketsByRange: 'stats/stats-by-range',
    ticketsByTags: 'stats/tickets-by-tags',
    ticketsByStatus: 'stats/tickets-by-status',
    ticketsBySource: 'stats/tickets-by-source',
    ticketsByAgents: 'stats/tickets-by-agent',
    ticketsCreatedPublished: 'stats/created-vs-published',
  };

  list(range: any): Observable<Tickets> {
    return this.http.post<Tickets>(this.getUrl(this.uris.ticketsByRange), range);
  }
}
