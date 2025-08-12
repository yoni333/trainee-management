import { createReducer, on } from '@ngrx/store';
import { AnalysisState } from '../../core/models/analysis.model';
import { AnalysisActions } from './analysis.actions';

const initialState: AnalysisState = {
  selectedIds: [],
  selectedSubjects: [],
  chartPositions: [
    { position: 0, chartType: 'gradesOverTime' },
    { position: 2, chartType: 'studentAverages' },
    { position: 1, chartType: 'subjectAverages' }
  ],
  availableIds: [],
  availableSubjects: [],
  loading: false,
  error: null
};

export const analysisReducer = createReducer(
  initialState,
  on(AnalysisActions.updateSelectedIDs, (state, { selectedIds }) => ({
    ...state,
    selectedIds
  })),
  on(AnalysisActions.updateSelectedSubjects, (state, { selectedSubjects }) => ({
    ...state,
    selectedSubjects
  })),
  on(AnalysisActions.swapCharts, (state, { fromPosition, toPosition }) => {
    const newPositions = [...state.chartPositions];
    const fromChart = newPositions.find(c => c.position === fromPosition);
    const toChart = newPositions.find(c => c.position === toPosition);
    
    if (fromChart && toChart) {
      const tempPosition = fromChart.position;
      fromChart.position = toChart.position;
      toChart.position = tempPosition;
    }
    
    return {
      ...state,
      chartPositions: newPositions
    };
  }),
  on(AnalysisActions.resetFilters, (state) => ({
    ...state,
    selectedIds: [],
    selectedSubjects: []
  }))
);
