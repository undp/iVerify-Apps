import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ErrorState } from '../store/states/error.state';
import { ApiServerError } from '../store/actions/error.actions';

export class ApiErrorInterceptor implements HttpInterceptor {
  private readonly excludes = [
    'users/me',
    'notifications_ex',
    'tags',
    'attributes',
    'assets/i18n'
  ];

  private isExcluded(req: HttpRequest<any>): boolean {
    return this.excludes.some(e => req.url.includes(e));
  }

  constructor(private store: Store<ErrorState>) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse && err.status !== 401) {
          const networkStatus =
            err.status === 0 && err.statusText == 'Unknown Error'
              ? false
              : true;
          if (!this.isExcluded(req) && networkStatus) {
            this.store.dispatch(new ApiServerError(err));
          }
          return networkStatus ? throwError(err) : of(null);
        }
        return throwError(err);
      })
    );
  }
}
