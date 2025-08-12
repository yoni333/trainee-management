import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TraineeService } from '../../core/services/trainee.service';
import { TraineeActions } from './trainee.actions';

@Injectable()
export class TraineeEffects {
  private actions$ = inject(Actions);
  private traineeService = inject(TraineeService);

  loadTrainees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TraineeActions.loadTrainees),
      switchMap(() =>
        this.traineeService.getAllTrainees().pipe(
          map(trainees => TraineeActions.loadTraineesSuccess({ trainees })),
          catchError(error => of(TraineeActions.loadTraineesFailure({ error: error.message })))
        )
      )
    )
  );

  addTrainee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TraineeActions.addTrainee),
      switchMap(({ trainee }) =>
        this.traineeService.addTrainee(trainee).pipe(
          map(newTrainee => TraineeActions.addTraineeSuccess({ trainee: newTrainee })),
          catchError(error => of(TraineeActions.addTraineeFailure({ error: error.message })))
        )
      )
    )
  );

  updateTrainee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TraineeActions.updateTrainee),
      switchMap(({ id, trainee }) =>
        this.traineeService.updateTrainee(id, trainee).pipe(
          map(updatedTrainee => TraineeActions.updateTraineeSuccess({ trainee: updatedTrainee })),
          catchError(error => of(TraineeActions.updateTraineeFailure({ error: error.message })))
        )
      )
    )
  );

  removeTrainee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TraineeActions.removeTrainee),
      switchMap(({ id }) =>
        this.traineeService.removeTrainee(id).pipe(
          map(() => TraineeActions.removeTraineeSuccess({ id })),
          catchError(error => of(TraineeActions.removeTraineeFailure({ error: error.message })))
        )
      )
    )
  );
}