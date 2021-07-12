import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '@iverify/api-interfaces';
import { environment } from '@iverify/core';
import { EAuthActions } from '@iverify/core/store/actions/auth.actions';
import { AppState } from '@iverify/core/store/states/app.state';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Spinkit } from 'ng-http-loader';

@Component({
  selector: 'iverify-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
 // hello$ = this.http.get<Message>('/api/hello');
  ngHttpLoaderConfig = environment.ngHttpLoaderConfig;
  spinkit = Spinkit;
  
  constructor(
  private http: HttpClient,
  private store: Store<AppState>,
  private actions$: Actions,
  private router: Router) {
  }

  ngOnInit() {
    this.actions$
      .pipe(ofType(EAuthActions.LoginSuccess))
      .subscribe(() => this.router.navigate(['/']));

    this.actions$
      .pipe(ofType(EAuthActions.LogoutSuccess))
      .subscribe(() =>  this.router.navigate(['/login']));

  }
}
