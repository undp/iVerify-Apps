import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { User } from '../models/user';
import { selectUser } from '../store/selectors/user.selector';
import { AppState } from '../store/states/app.state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectLocation } from '../store/selectors/location.selector';
import { Location } from '../models/location';
@Injectable({
  providedIn: 'root',
})
export class LocationGuard implements CanActivate, CanActivateChild {
  location$: Observable<Location | null> = this.store.select(selectLocation);

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
    return this.location$.pipe(
      map((location) => {
        if (!location) {
          this.router.navigate(['/location']);
          return false;
        }
        return true;
      })
    );
  }
}
