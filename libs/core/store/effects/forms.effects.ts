import { Injectable } from '@angular/core';
import { FormService } from '@eview/core/domain/form/form.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import {
  EFormsActions,
  ListForms,
  ListFormsFailure,
  ListFormsSuccess
} from '../actions/forms.actions';

@Injectable()
export class FormsEffects {
  constructor(private formService: FormService, private actions$: Actions) {}

  @Effect()
  list: Observable<any> = this.actions$.pipe(
    ofType<ListForms>(EFormsActions.ListForms),
    switchMap(action => {
      return this.formService.listForms().pipe(
        switchMap(payload => [
          payload
            ? new ListFormsSuccess(payload)
            : new ListFormsFailure()
        ]),
        catchError(error => [new ListFormsFailure()])
      );
    }),
    catchError(error => [new ListFormsFailure()])
  );
}
