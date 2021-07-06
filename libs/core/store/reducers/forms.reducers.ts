import { EFormsActions, FormsActions } from '../actions/forms.actions';
import { FormsState, initialFormsState } from '../states/forms.state';

export function formsReducers(
  state = initialFormsState,
  action: FormsActions
): FormsState {
  switch (action.type) {
    case EFormsActions.ListFormsSuccess: {
      return {
        ...state,
        forms: action.payload        
      };
    }

    case EFormsActions.ListFormsFailure: {
      if (state && state.forms)
      return {
        ...state,
        forms: null
      };
    }
    default:
      return state;
  }
}
