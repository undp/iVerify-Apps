import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { User } from '../../core/models/user';
import { selectUser } from '../../core/store/selectors/user.selector';
import { AppState } from '../../core/store/states/app.state';
import { Store } from '@ngrx/store';
import { Observable, of, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PrivateSiteGuard implements CanActivate, CanActivateChild {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.canActivate(childRoute, state);
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.user$.pipe(
      map(u => {
        if (!u) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
  user$: Observable<User> = this.store.select(selectUser);
}
