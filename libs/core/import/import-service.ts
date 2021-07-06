import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { BaseService } from '@eview/core/base/base-service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImportService extends BaseService {

  readonly uris = {
    csv: 'csv',
    map: 'csv/:id',
    import: 'csv/:id/import'
  }

  upload (formData): Observable<any> {
    return this.http.post<any>(this.getUrl(this.uris.csv), formData).pipe(
      catchError(err => {
        return err;
      })
    )
  }

  mapAttributes(formData, id): Observable<any> {
    return this.http.put<any>(this.getUrl(this.uris.map).replace(':id', id.toString()), formData);
  }

  importCSV(id): Observable<any> {
    return this.http.post<any>(this.getUrl(this.uris.import).replace(':id', id.toString()), {});
  }

  
}

export interface CSVMap {
  columns: string[];
  maps_to: string[];
  fixed: Object
}
