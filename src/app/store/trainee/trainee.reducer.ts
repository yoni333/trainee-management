import { createReducer, on } from '@ngrx/store';
import { TraineeState } from '../../core/models/trainee.model';
import { TraineeActions } from './trainee.actions';

const initialState: TraineeState = {
  trainees: [],
  selectedTrainee: null,
  filters: {
    searchTerm: '',
    subject: undefined,
    minGrade: undefined,
    maxGrade: undefined
  },
  loading: false,
  error: null
};

export const traineeReducer = createReducer(
  initialState,
  on(TraineeActions.loadTrainees, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TraineeActions.loadTraineesSuccess, (state, { trainees }) => ({
    ...state,
    trainees,
    loading: false,
    error: null
  })),
  on(TraineeActions.loadTraineesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(TraineeActions.selectTrainee, (state, { trainee }) => ({
    ...state,
    selectedTrainee: trainee
  })),
  on(TraineeActions.clearSelection, (state) => ({
    ...state,
    selectedTrainee: null
  })),
  on(TraineeActions.addTraineeSuccess, (state, { trainee }) => ({
    ...state,
    trainees: [...state.trainees, trainee],
    loading: false
  })),
  on(TraineeActions.updateTraineeSuccess, (state, { trainee }) => ({
    ...state,
    trainees: state.trainees.map(t => t.id === trainee.id ? trainee : t),
    selectedTrainee: state.selectedTrainee?.id === trainee.id ? trainee : state.selectedTrainee,
    loading: false
  })),
  on(TraineeActions.removeTraineeSuccess, (state, { id }) => ({
    ...state,
    trainees: state.trainees.filter(t => t.id !== id),
    selectedTrainee: state.selectedTrainee?.id === id ? null : state.selectedTrainee
  })),
  on(TraineeActions.updateFilters, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters }
  }))
);