import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

export abstract class BaseComponent {
  constructor() {}

  // ngOnDestroy() {
  //   if (this._destroy$) {
  //     this._destroy$.next(true);
  //     this._destroy$.complete();
  //   }
  // }

  // private _destroy$: Subject<any>;

  // get destroy$() {
  //   if (!this._destroy$) this._destroy$ = new Subject();
  //   return this._destroy$;
  // }
}
