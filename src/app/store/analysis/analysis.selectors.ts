import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AnalysisState } from '../../core/models/analysis.model';
import { selectAllTrainees } from '../trainee/trainee.selectors';

export const selectAnalysisState = createFeatureSelector<AnalysisState>('analysis');

export const selectSelectedIds = createSelector(
  selectAnalysisState,
  (state) => state.selectedIds
);

export const selectSelectedSubjects = createSelector(
  selectAnalysisState,
  (state) => state.selectedSubjects
);

export const selectChartPositions = createSelector(
  selectAnalysisState,
  (state) => state.chartPositions
);

export const selectAvailableIds = createSelector(
  selectAllTrainees,
  (trainees) => [...new Set(trainees.map(t => t.id))]
);

export const selectAvailableSubjects = createSelector(
  selectAllTrainees,
  (trainees) => [...new Set(trainees.map(t => t.subject))]
);

export const selectFilteredTraineesForCharts = createSelector(
  selectAllTrainees,
  selectSelectedIds,
  selectSelectedSubjects,
  (trainees, selectedIds, selectedSubjects) => {
    return trainees.filter(trainee => {
      const matchesIds = selectedIds.length === 0 || selectedIds.includes(trainee.id);
      const matchesSubjects = selectedSubjects.length === 0 || selectedSubjects.includes(trainee.subject);
      return matchesIds && matchesSubjects;
    });
  }
);

export const selectChartByPosition = (position: number) => createSelector(
  selectChartPositions,
  (positions) => positions.find(p => p.position === position)
);
