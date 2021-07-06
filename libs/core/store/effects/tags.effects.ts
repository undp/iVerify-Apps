import { Injectable } from '@angular/core';
import { TagService } from '@eview/core/domain/tags/tag.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import {
  ETagsActions,
  ListTags,
  ListTagsFailure,
  ListTagsSuccess
} from '../actions/tags.actions';

@Injectable()
export class TagsEffects {
  constructor(private tagService: TagService, private actions$: Actions) {}

  @Effect()
  list: Observable<any> = this.actions$.pipe(
    ofType<ListTags>(ETagsActions.ListTags),
    switchMap(() => {
      return this.tagService.list().pipe(
        switchMap(payload => [
          payload ? new ListTagsSuccess(payload) : new ListTagsFailure()
        ]),
        catchError(error => [new ListTagsFailure()])
      );
    }),
    catchError(error => [new ListTagsFailure()])
  );
}
