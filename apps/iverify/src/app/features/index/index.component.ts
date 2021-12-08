import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
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
import { MediaMatcher } from '@angular/cdk/layout';
import { isEmpty } from 'lodash';


const ADMIN_ROLE = 'admin';
const USER_ROLE = 'users';
@Component({
  selector: 'iverify-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
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
  isUserAllowedUserMenu: boolean = false;
  isDashboardTextHide: boolean = true;

  AuthHelpers = AuthHelpers;

  Permission = Permission;
  pageInfo:any = { logo : { header: false, sidebar: true }};
  protected fromdate: Date;
  protected todate: Date;
  viewportMobileQuery: MediaQueryList;
  
  constructor(
    store: Store<AppState>,
    private actions$: Actions,
    private router: Router,
    private translate: TranslateService,
    private modalService: NgbModal,
    private spinner: SpinnerVisibilityService,
    private changeDetectionRef: ChangeDetectorRef,
    private media: MediaMatcher
  ) {
    super();
    this.store = store
    this.subs = new Subscription();
    this.user$ = this.store.select(selectUser);
    this.userPermissions$ = this.store.select(
      selectUserPermissions
    );  
    this.viewportMobileQuery = media.matchMedia('(max-width: 600px)');
    this._viewportQueryListener = () => changeDetectionRef.detectChanges();
    this.viewportMobileQuery.addEventListener('change', this._viewportQueryListener);
  }

  private _viewportQueryListener: () => void;
  

  ngOnInit() {
    this.isUserAllowed();
    this.subs.add(
      this.router.events.subscribe(e => {
        if (e instanceof ActivationStart) {
          window.scroll(0, 0);
          if (e.snapshot.outlet === 'dashboard') {
            this.outlet.deactivate();
            this.isDashboardTextHide = true;
          } else {
            this.isDashboardTextHide = false;
          }
        }
      })
    );
  }

  ngOnDestroy() {
    this.viewportMobileQuery.removeEventListener('change', this._viewportQueryListener);
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


  isUserAllowed() {
    this.user$.subscribe((user) => {
      if (user) {
      let role = user.roles[0];
      if (role && role.resource && role.resource.length > 0) {
        const resources = JSON.parse(role.resource);
        if (!isEmpty(resources)) {
          const roleItem = resources.filter((sect: any) => sect.name === 'users');
          if (!isEmpty(roleItem)) {
            const val = roleItem[0].permissions.find((item: string) => item === 'read');
            this.isUserAllowedUserMenu =  (val !== undefined);            
          }
        }
      }
    }
    });
  }

  onLogoutClick() {
    this.store.dispatch(new Logout());
  }

}
