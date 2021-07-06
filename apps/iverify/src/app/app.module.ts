import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from './features/auth/auth.module';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, AuthModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
