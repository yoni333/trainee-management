import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';
import { MonitorActions } from './monitor.actions';
import { selectAvailableIds } from './monitor.selectors';

@Injectable()
export class MonitorEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);

  loadMonitorData$ = createEffect(() =>
  this.actions$.pipe(
    ofType(MonitorActions.loadMonitorData),
    withLatestFrom(this.store.select(selectAvailableIds)),
    map(([action, availableIds]) => {
      // Return the success action instead
      return MonitorActions.loadMonitorDataSuccess();
    })
  )
);
}
