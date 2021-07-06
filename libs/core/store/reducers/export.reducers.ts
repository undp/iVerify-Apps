import { EExportActions, ExportActions } from '../actions/export.actions';
import { ExportState, initialExportState } from '../states/export.state';

export function exportReducers(
  state = initialExportState,
  action: ExportActions
): ExportState {
  switch (action.type) {
    case EExportActions.CreateJobSuccess: {
      if (state && state.jobs && state.jobs.timer)
        clearInterval(state.jobs.timer);
      return {
        ...state,
        jobs: {
          last: action.payload,
          timer: null
        }
      };
    }

    case EExportActions.CreateJobFailure: {
      if (state && state.jobs && state.jobs.timer)
        clearInterval(state.jobs.timer);
      return {
        ...state,
        jobs: {
          last: null,
          timer: null
        }
      };
    }

    case EExportActions.CheckLastJobSuccess: {
      return {
        ...state,
        jobs: {
          ...state.jobs,
          timer: action.payload
        }
      };
    }

    case EExportActions.LastJobSuccess:
    case EExportActions.LastJobFailure: {
      if (state && state.jobs && state.jobs.timer)
        clearInterval(state.jobs.timer);
      return {
        ...state,
        jobs: {
          ...state.jobs,
          last:
            action.type === EExportActions.LastJobSuccess
              ? action.payload
              : null,
          timer: null
        }
      };
    }

    default:
      return state;
  }
}
