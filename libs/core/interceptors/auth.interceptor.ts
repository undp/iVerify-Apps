import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { environment } from '../environments/environment';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  private readonly excludes = ['oauth/token', 'storage'];

  private isExcluded(req: HttpRequest<any>): boolean {
    return this.excludes.some(e => req.url.includes(e));
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.isExcluded(req)
      ? next.handle(req)
      : from(this.authService.token()).pipe(
          switchMap(token => {
            if (token) {
              req = req.clone({
                headers: req.headers.set(
                  environment.authentication.token_header,
                  `${token.token_type} ${token.access_token}`
                )
              });
            }
            return next.handle(req);
          })
        );
  }
}
