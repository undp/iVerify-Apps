import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  APP_INITIALIZER,
  Inject,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf
} from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { Store, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateService } from '@ngx-translate/core';
import { throwIfAlreadyLoaded } from '../utils/angular';
import { environment } from './environments/environment';
import { AuthInterceptor } from '@iverify/core/interceptors/auth.interceptor';
import { AuthService } from '@iverify/core/auth';
import { CORE_PROVIDERS, PlatformLanguageToken, PlatformWindowToken } from './services';
import { UserLoggedIn } from './store/actions/app.actions';
import { GetCurrentUser, LogoutSuccess } from './store/actions/auth.actions';
import { appEffects } from './store/effects/app.effects';
import { appReducers } from './store/reducers/app.reducers';
import { AppState } from './store/states/app.state';
import { storageMetaReducer } from './storage.metareducer';
import { ApiErrorInterceptor } from './interceptors/error.interceptor';
import { StorageService } from '@iverify/core/storage/storage.service';
import { Login } from '@iverify/core/store/actions/auth.actions';
/**
 * DEBUGGING
 */

// factories
export function winFactory() {
  return window;
}

export function platformLangFactory() {
  const browserLang = window.navigator.language || 'en'; // fallback English
  // browser language has 2 codes, ex: 'en-US'
  return browserLang.split('-')[0];
}

export const BASE_PROVIDERS: any[] = [
  ...CORE_PROVIDERS,
  { provide: APP_BASE_HREF, useValue: '/' },
  {
    provide: APP_INITIALIZER,
    useFactory: appInit,
    deps: [AuthService, Store, StorageService],
    multi: true
  },
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ApiErrorInterceptor,
    deps: [Store],
    multi: true
  }
];

function initActions(auth: any, store: any) {
    const { token } = auth.init();
    if (token && auth.hasRefreshToken(token)) {
      store.dispatch(new GetCurrentUser());
      store.dispatch(new UserLoggedIn());
    } else {
      const params = new URLSearchParams(window.location.search);
      if (params.has('code')) {
        store.dispatch(
        new Login({
            code: params.get('code')
          })
        );
      }
    }
    if (!token) {
      store.dispatch(new LogoutSuccess());
    }
}

export function appInit(auth: AuthService, store: Store<AppState>, storage: StorageService) {
  return () => {
    initActions(auth, store);
  }
}

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot(appReducers, {
      metaReducers: [storageMetaReducer]
    }),
    EffectsModule.forRoot(appEffects),
    
    StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [
    { provide: PlatformWindowToken, useFactory: winFactory } ,
    { provide: PlatformLanguageToken, useFactory: platformLangFactory }
  ]
})

export class CoreModule {
  static forRoot(configuredProviders: Array<any>): ModuleWithProviders<NgModule> {
    return {
      ngModule: CoreModule,
      providers: [...BASE_PROVIDERS, ...configuredProviders]
    };
  }

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule,
    @Inject(PlatformLanguageToken) lang: string,
    translate: TranslateService
  ) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
    translate.setDefaultLang(environment.defaultLanguage);
    translate.use(environment.defaultLanguage);
  }
}
