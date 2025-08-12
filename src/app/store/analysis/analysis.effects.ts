import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';
import { AnalysisActions } from './analysis.actions';
import { selectAvailableIds, selectAvailableSubjects } from './analysis.selectors';

@Injectable()
export class AnalysisEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);

  loadAnalysisData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnalysisActions.loadAnalysisData),
      withLatestFrom(
        this.store.select(selectAvailableIds),
        this.store.select(selectAvailableSubjects)
      ),
      map(([action, ids, subjects]) => {
        // Initialize with some default selections if needed
        return AnalysisActions.updateSelectedIDs({ selectedIds: ids.slice(0, 3) });
      })
    )
  );
}
