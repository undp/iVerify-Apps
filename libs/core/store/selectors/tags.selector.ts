import { AppState } from '../states/app.state';
import { createSelector } from '@ngrx/store';
import { TagsState } from '../states/tags.state';

const tagsState = (state: AppState) => state.tags;

export const selectTags = createSelector(
  tagsState,
  (state: TagsState) => state.tags
);
