import { Injectable } from '@angular/core';
import { ExportService } from '@eview/core/domain/export/export.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  CreateJob,
  EExportActions,
  CreateJobSuccess,
  CreateJobFailure,
  CheckLastJobSuccess,
  LastJobSuccess
} from '../actions/export.actions';
import { switchMap, catchError, take } from 'rxjs/operators';
import { environment } from '@eview/core/environments/environment';
import { ExportJobStatus } from '@eview/core/domain/export/export';
import { AppState } from '../states/app.state';
import { Store } from '@ngrx/store';
import { selectExportJob } from '../selectors/export.selector';

@Injectable()
export class ExportEffects {
  constructor(
    private exportService: ExportService,
    private actions$: Actions,
    private store: Store<AppState>
  ) {}

  @Effect()
  createJob = this.actions$.pipe(
    ofType<CreateJob>(EExportActions.CreateJob),
    switchMap(action => {
      return this.exportService.createJob(action.payload).pipe(
        switchMap(payload => [
          payload ? new CreateJobSuccess(payload) : new CreateJobFailure()
        ]),
        catchError(error => [new CreateJobFailure()])
      );
    }),
    catchError(error => [new CreateJobFailure()])
  );

  @Effect()
  checkLastJob = this.actions$.pipe(
    ofType<CreateJobSuccess>(EExportActions.CreateJobSuccess),
    switchMap(() => {
      const timer = setInterval(() => {
        const obs = this.store
          .select(selectExportJob)
          .pipe(switchMap(jobs => this.exportService.readJob(jobs.last.id)))
          .subscribe(exportJob => {
            obs.unsubscribe();
            if (exportJob.status != ExportJobStatus.Success) return;
            clearInterval(timer);
            this.store.dispatch(new LastJobSuccess(exportJob));
          });
      }, environment.export.timing * 1000) as any;
      return [new CheckLastJobSuccess(timer)];
    })
  );
}
