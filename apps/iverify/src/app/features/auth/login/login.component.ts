import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@iverify/core/environments/environment';
// import { ConfigHelpers } from '@eview/core/config/config.helpers';
// import { SiteConfigItem } from '@eview/core/models/config';
import { EAuthActions, Login } from '@iverify/core/store/actions/auth.actions';
// import { selectConfig } from '@eview/core/store/selectors/config.selector';
import { AppState } from '@iverify/core/store/states/app.state';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
// import { ToastType } from '../../toast/toast.component';
// import { ToastService } from '../../toast/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { ListUsers 						} from '@eview/core/store/actions/users.actions';

@Component({
  selector: 'iverify-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    // private toast: ToastService,
    private router: Router,
    // private modalService	: NgbModal
  ) {
    this.subs = new Subscription();
  }

  ngOnInit() {
    document.body.style.alignItems = 'center';

    this.subs.add(
      this.actions$.pipe(ofType(EAuthActions.LoginFailure)).subscribe(() => {
        // this.toast.show(ToastType.Warning, 'TOAST_LOGIN_ERROR');
        this.loginForm.patchValue({ password: '' });
      })
    );

    this.subs.add(
      this.router.events.subscribe(() => {
        document.body.style.alignItems = 'unset';
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  // siteConfig$: Observable<SiteConfigItem> = this.store
  //   .select(selectConfig)
  //   .pipe(
  //     map(config =>
  //       ConfigHelpers.GetConfigItem<SiteConfigItem>(SiteConfigItem, config)
  //     )
  //   );

  // deploymentName$: Observable<string> = this.siteConfig$.pipe(
  //   map(siteConfig =>
  //     siteConfig ? siteConfig.name : environment.deploymentName
  //   )
  // );

  // footer$: Observable<string> = this.siteConfig$.pipe(
  //   map(siteConfig =>
  //     siteConfig ? siteConfig.description : environment.footer.text
  //   )
  // );

  // private$: Observable<boolean> = this.siteConfig$.pipe(
  //   map(siteConfig => (siteConfig ? siteConfig.private : true))
  // );

  footer = {
    ...environment.footer,
    year: new Date().getFullYear()
  };

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  showPassword: boolean = false;

  private subs: Subscription;

  onLoginClick() {
    this.showPassword = false;
    const email = this.loginForm.get('email')?.value.trim();
    const password = this.loginForm.get('password')?.value.trim();
    if (email && password) {
      this.store.dispatch(
        new Login({
          email: email,
          password: password
        })
      );
    }
  }

  onForgotPasswordClick() {
    // TODO
  }

  // onSubmitClick() {
  //   this.store.dispatch(new ListUsers());
	// 	this.modalService.dismissAll();
	// }

  // onRegisterClick(content) {
  //   this.modalService.open(content, { centered: true });
  //   // TODO
  // }
}
