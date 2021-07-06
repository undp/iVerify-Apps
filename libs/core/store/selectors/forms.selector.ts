import { createSelector } from '@ngrx/store';
import { AppState } from '../states/app.state';
import { FormsState } from '../states/forms.state';

const formsState = (state: AppState) => state.forms;

export const selectForms = createSelector(
  formsState,
  (state: FormsState) => state.forms
);
