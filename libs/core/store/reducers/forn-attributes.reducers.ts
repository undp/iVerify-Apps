import {
  initialFormAttributesState,
  FormAttributesState
} from '../states/form-attributes.state';
import {
  FormAttributesActions,
  EFormAttributesActions
} from '../actions/form-attributes.actions';

export function formAttributesReducers(
  state = initialFormAttributesState,
  action: FormAttributesActions
): FormAttributesState {
  switch (action.type) {
    case EFormAttributesActions.ListFormAttributesSuccess: {
      return {
        ...state,
        formAttributes: action.payload
      };
    }

    case EFormAttributesActions.ListFormAttributesFailure: {
      return {
        ...state,
        formAttributes: null
      };
    }

    default:
      return state;
  }
}
