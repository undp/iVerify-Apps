import { ETagsActions, TagsActions } from '../actions/tags.actions';
import { initialTagsState, TagsState } from '../states/tags.state';

export function tagsReducers(
  state = initialTagsState,
  action: TagsActions
): TagsState {
  switch (action.type) {
    case ETagsActions.ListTagsSuccess: {
      return {
        ...state,
        tags: action.payload
      };
    }

    case ETagsActions.ListTagsFailure: {
      return {
        ...state,
        tags: null
      };
    }

    default:
      return state;
  }
}
