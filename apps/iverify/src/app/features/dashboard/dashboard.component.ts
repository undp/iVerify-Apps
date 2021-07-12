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

@Component({
  selector: 'iverify-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  subs: Subscription;
  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    // private toast: ToastService,
    private router: Router
    // private modalService	: NgbModal
  ) {
    this.subs = new Subscription();
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }
}