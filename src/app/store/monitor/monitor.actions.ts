import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { MonitorFilters } from '../../core/models/monitor.model';

export const MonitorActions = createActionGroup({
  source: 'Monitor',
  events: {
    'Update Selected IDs': props<{ selectedIds: string[] }>(),
    'Update Name Search': props<{ nameSearch: string }>(),
    'Update State Filter': props<{ showPassed: boolean; showFailed: boolean }>(),
    'Reset Filters': emptyProps(),
    'Load Monitor Data': emptyProps(),
    'Load Monitor Data Success': emptyProps(),  // ADD THIS LINE
  }
});
