import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AnalysisActions = createActionGroup({
  source: 'Analysis',
  events: {
    'Update Selected IDs': props<{ selectedIds: string[] }>(),
    'Update Selected Subjects': props<{ selectedSubjects: string[] }>(),
    'Swap Charts': props<{ fromPosition: number; toPosition: number }>(),
    'Load Analysis Data': emptyProps(),
    'Reset Filters': emptyProps(),
  }
});
