import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivationStart, Router, RouterOutlet } from '@angular/router';
import { BaseComponent, environment } from '@iverify/core';
import { AuthHelpers } from '@iverify/core/auth';
import { Permission } from '@iverify/core/auth/permission';
import { TranslateService } from '@ngx-translate/core';
import { User } from '@iverify/core/models/user';
import { UserPermissions } from '@iverify/core/models/user-permissions';
import { Logout } from '@iverify/core/store/actions/auth.actions';

import { selectUserPermissions } from '@iverify/core/store/selectors/user-permissions.selector';
import { selectUser } from '@iverify/core/store/selectors/user.selector';
import { AppState } from '@iverify/core/store/states/app.state';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerVisibilityService } from 'ng-http-loader';

@Component({
  selector: 'iverify-index',
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.scss']
})
export class IndexComponent extends BaseComponent implements OnInit, OnDestroy {

  unreadNotifications$: Observable<boolean>
  isNetworkAvailable$: Observable<any>
  userPermissions$: Observable<UserPermissions>
  user$: Observable<User>
  footer$: Observable<string>
  store: Store<AppState>
  time = { hour: 'Hrs', minute: 'Mins' };
  countryCodes = environment.countryCodes;
  currentLang: string = this.translate.currentLang;

  AuthHelpers = AuthHelpers;

  Permission = Permission;
  pageInfo:any = { logo : { header: false, sidebar: true }};
  
  constructor(
    store: Store<AppState>,
    private actions$: Actions,
    private router: Router,
    private translate: TranslateService,
    private modalService: NgbModal,
    private spinner: SpinnerVisibilityService
  ) {
    super();
    this.store = store
    this.subs = new Subscription();
    this.user$ = this.store.select(selectUser);
    this.userPermissions$ = this.store.select(
      selectUserPermissions
    );  
  }
  

  ngOnInit() {
    this.subs.add(
      this.router.events.subscribe(e => {
        if (e instanceof ActivationStart) {
          window.scroll(0, 0);
          if (e.snapshot.outlet === 'dashboard') this.outlet.deactivate();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  @ViewChild(RouterOutlet, { static: false }) outlet: RouterOutlet;

  private subs: Subscription;

  footer = {
    ...environment.footer,
    year: new Date().getFullYear()
  };

  hasUserPermission(permission: Permission) {
    return AuthHelpers.User.HasUserPermission(this.store, permission);
  }

  onLogoutClick() {
    this.store.dispatch(new Logout());
  }

}
