import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthModule } from './features/auth/auth.module';
import { CoreModule } from '@iverify/core/core.module';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { fas } from '@fortawesome/free-solid-svg-icons';
import {
  FaIconLibrary,
  FontAwesomeModule
} from '@fortawesome/angular-fontawesome';
// libs
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app.routing';
import { IndexModule } from './features/index/index.module';
import { SettingsModule } from './features/settings/settings.module';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, `./assets/i18n/`, '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [CoreModule.forRoot([]), 
  NgHttpLoaderModule.forRoot(),
  TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
        }
  }),
  BrowserAnimationsModule, NgbModule, IndexModule, FontAwesomeModule, BrowserModule, HttpClientModule, AppRoutingModule, AuthModule, RouterModule,
  SettingsModule
  ],
  exports:[],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    library: FaIconLibrary,
  ) {
    library.addIconPacks(fas);
  }
}
