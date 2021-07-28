import {ActionReducer, Action} from '@ngrx/store';
import { environment } from './environments/environment';
import { merge } from 'lodash';

function setSavedState(state: any, localStorageKey: string) {
  localStorage.setItem(localStorageKey, JSON.stringify(state));
}
function getSavedState(localStorageKey: string): any {
  return JSON.parse(localStorage.getItem(localStorageKey));
}
// the key for the local storage.
const APP_STATE_KEY = environment.app_state_key;

export function storageMetaReducer<S, A extends Action = Action> (reducer: ActionReducer<S, A>) {
  let onInit = true;
  return function(state: S, action: A): S {
    const nextState = reducer(state, action);
    // init the application state.
    if (onInit) {
      onInit           = false;
      const savedState = getSavedState(APP_STATE_KEY);
      return merge(nextState, savedState);
    }
    // save the next state to the application storage.
    setSavedState(nextState, APP_STATE_KEY);
    return nextState;
  };
}