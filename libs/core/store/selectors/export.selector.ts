import { createSelector } from '@ngrx/store';
import { AppState } from '../states/app.state';
import { ExportState } from '../states/export.state';

const exportState = (state: AppState) => state.export;

export const selectExportJob = createSelector(
  exportState,
  (state: ExportState) => state.jobs
);
