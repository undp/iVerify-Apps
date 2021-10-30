import { AuthRequest, AuthResponse, GrantType } from './auth';
import { Observable, of } from 'rxjs';
import { Token, TokenPayload } from './token';
import { catchError, switchMap } from 'rxjs/operators';
import { HttpErrorResponse , HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Permissions } from '../models/permissions';
import { Roles } from '../models/roles';
import { StorageService } from '@iverify/core/storage/storage.service';
import { User } from '../models/user';
import { environment } from '../environments/environment';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot
} from '@angular/router';

const STORAGE_TOKEN_KEY = 'token';
const APP_STATE_KEY = environment.app_state_key;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private storage: StorageService, private router: Router) {}

  private readonly uris = {
    main: 'auth/login',
    me: `users/UserId?userId=:id`,
    roles: `api/${environment.api.version}/roles`,
    permissions: `api/${environment.api.version}/permissions`,
    authCallback: 'auth/callback'
  };

  private _token: Token = null as any;
  private offset: number = 0;

  init(): { token: Token } {
    const tokenData = this.storage.get(STORAGE_TOKEN_KEY);
    this._token = tokenData?.token;
    if (!this.isTokenValid(this._token)) {
      this.storage.remove(STORAGE_TOKEN_KEY);
      this._token = null as any;
    }
    return { token: this._token };
  }

  sendRequest(request: AuthRequest = {}): Observable<AuthResponse> {
    let url = this.uris.main;
    if (request.code) {
      url = this.uris.authCallback;
    }
    return this.http
      .post<AuthResponse>(`${environment.api.base}/${url}`, {
        ...request
      })
      .pipe(
        switchMap(loginResponse => {
          this._token = { ...this.token, ...loginResponse.token};
          this.storage.set(STORAGE_TOKEN_KEY, loginResponse);
          const payload = this.getTokenPayload(this._token);
          if (payload && payload.iat)
            this.offset = Math.ceil(new Date().getTime() / 1000) - payload.iat;
          return [loginResponse];
        }),
        catchError(error => {
          this._token = null as any;
          this.storage.set(STORAGE_TOKEN_KEY, this._token);
          return [null as any];
        })
      );
  }

  me(): Observable<User> {
    const tokenData = this.storage.get(STORAGE_TOKEN_KEY);
    let userId = (tokenData) ? tokenData['userData'].email : '';
    this.uris.me = this.uris.me.replace(':id', userId);
    return this.http.get<any>(`${environment.api.base}/${this.uris.me}`).pipe(
      catchError(err => {
        return this.cacheHandler(err, 'user');
      })
    );
  }

  roles(): Observable<Roles> {
    return this.http
      .get<Roles>(`${environment.api.base}/${this.uris.roles}`)
      .pipe(
        catchError(err => {
          return this.cacheHandler(err, 'roles');
        })
      );
  }

  permissions(): Observable<Permissions> {
    return this.http
      .get<Permissions>(`${environment.api.base}/${this.uris.permissions}`)
      .pipe(
        catchError(err => {
          return this.cacheHandler(err, 'permissions');
        })
      );
  }

  token(): Observable<any> {
    if (this.isTokenValid(this._token)) return of(this._token);
    if (this.hasRefreshToken(this._token)) {
      this.router.navigate(['/']);
    }
    // return this.sendRequest(
    //   {
    //     client_id: environment.authentication.client_id,
    //     client_secret: environment.authentication.client_secret,
    //     grant_type: GrantType.RefreshToken,
    //     refresh_token: this._token.refreshToken
    //   }
    // );
    return of(null);
  }

  getTokenPayload(token: any): TokenPayload | null {
    try {
      const [, payload] = token.accessToken.split('.');
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  isTokenValid(token: Token): boolean {
    const payload = this.getTokenPayload(token);
    if (!payload) return false;
    const now = Math.ceil(new Date().getTime() / 1000) + this.offset;
    return now < payload.exp;
  }

  hasRefreshToken(token: Token): boolean {
    if (token && token.refreshToken) return true;
    return false;
  }

  clearToken() {
    this._token = null as any;
    this.storage.remove(STORAGE_TOKEN_KEY);
  }

  cacheHandler(err: Error, key: string) {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 0 && err.statusText == 'Unknown Error') {
        const appData = this.storage.get(APP_STATE_KEY);
        return of(appData[key] ? appData[key][key] : null);
      } else {
        return of(null);
      }
    }
    return of(null);
  }
}
