import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TraineeState } from '../../core/models/trainee.model';

export const selectTraineeState = createFeatureSelector<TraineeState>('trainee');

export const selectAllTrainees = createSelector(
  selectTraineeState,
  (state) => state.trainees
);

export const selectSelectedTrainee = createSelector(
  selectTraineeState,
  (state) => state.selectedTrainee
);

export const selectTraineeFilters = createSelector(
  selectTraineeState,
  (state) => state.filters
);

export const selectFilteredTrainees = createSelector(
  selectAllTrainees,
  selectTraineeFilters,
  (trainees, filters) => {
    return trainees.filter(trainee => {
      const matchesSearch = !filters.searchTerm || 
        trainee.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        trainee.subject.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const matchesSubject = !filters.subject || trainee.subject === filters.subject;
      const matchesMinGrade = !filters.minGrade || trainee.grade >= filters.minGrade;
      const matchesMaxGrade = !filters.maxGrade || trainee.grade <= filters.maxGrade;
      
      return matchesSearch && matchesSubject && matchesMinGrade && matchesMaxGrade;
    });
  }
);

export const selectLoading = createSelector(
  selectTraineeState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectTraineeState,
  (state) => state.error
);
