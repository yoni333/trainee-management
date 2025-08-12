import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Trainee, TraineeFilters } from '../../core/models/trainee.model';

export const TraineeActions = createActionGroup({
  source: 'Trainee',
  events: {
    'Load Trainees': emptyProps(),
    'Load Trainees Success': props<{ trainees: Trainee[] }>(),
    'Load Trainees Failure': props<{ error: string }>(),
    
    'Select Trainee': props<{ trainee: Trainee }>(),
    'Clear Selection': emptyProps(),
    
    'Add Trainee': props<{ trainee: Omit<Trainee, 'id'> }>(),
    'Add Trainee Success': props<{ trainee: Trainee }>(),
    'Add Trainee Failure': props<{ error: string }>(),
    
    'Update Trainee': props<{ id: string; trainee: Trainee }>(),
    'Update Trainee Success': props<{ trainee: Trainee }>(),
    'Update Trainee Failure': props<{ error: string }>(),
    
    'Remove Trainee': props<{ id: string }>(),
    'Remove Trainee Success': props<{ id: string }>(),
    'Remove Trainee Failure': props<{ error: string }>(),
    
    'Update Filters': props<{ filters: Partial<TraineeFilters> }>(),
  }
});