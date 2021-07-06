import { Injectable } from '@angular/core';
import { FormService } from '@eview/core/domain/form/form.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import {
  EFormAttributesActions,
  ListFormAttributes,
  ListFormAttributesFailure,
  ListFormAttributesSuccess
} from '../actions/form-attributes.actions';

@Injectable()
export class FormAttributesEffects {
  constructor(private formService: FormService, private actions$: Actions) {}

  @Effect()
  list: Observable<any> = this.actions$.pipe(
    ofType<ListFormAttributes>(EFormAttributesActions.ListFormAttributes),
    switchMap(action => {
      return this.formService.listAttributes(action.payload.id).pipe(
        switchMap(payload => [
          payload
            ? new ListFormAttributesSuccess(payload)
            : new ListFormAttributesFailure()
        ]),
        catchError(error => [new ListFormAttributesFailure()])
      );
    }),
    catchError(error => [new ListFormAttributesFailure()])
  );
}
