import { AppState } from '../states/app.state';
import { createSelector } from '@ngrx/store';
import { FormAttributesState } from '../states/form-attributes.state';

const formAttributesState = (state: AppState) => state.formAttributes;

export const selectFormAttributes = createSelector(
  formAttributesState,
  (state: FormAttributesState) => state.formAttributes
);
