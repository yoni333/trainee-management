import { createReducer, on } from '@ngrx/store';
import { MonitorState } from '../../core/models/monitor.model';
import { MonitorActions } from './monitor.actions';

const initialState: MonitorState = {
  filters: {
    selectedIds: [],
    nameSearch: '',
    showPassed: true,
    showFailed: true
  },
  availableIds: [],
  loading: false,
  error: null
};

export const monitorReducer = createReducer(
  initialState,
  on(MonitorActions.updateSelectedIDs, (state, { selectedIds }) => {
    console.log('Monitor reducer: updating selected IDs', selectedIds);
    return {
      ...state,
      filters: {
        ...state.filters,
        selectedIds
      }
    };
  }),
  on(MonitorActions.updateNameSearch, (state, { nameSearch }) => {
    console.log('Monitor reducer: updating name search', nameSearch);
    return {
      ...state,
      filters: {
        ...state.filters,
        nameSearch
      }
    };
  }),
  on(MonitorActions.updateStateFilter, (state, { showPassed, showFailed }) => {
    console.log('Monitor reducer: updating state filter', { showPassed, showFailed });
    return {
      ...state,
      filters: {
        ...state.filters,
        showPassed,
        showFailed
      }
    };
  }),
  on(MonitorActions.resetFilters, (state) => {
    console.log('Monitor reducer: resetting filters');
    return {
      ...state,
      filters: {
        selectedIds: [],
        nameSearch: '',
        showPassed: true,
        showFailed: true
      }
    };
  }),
  on(MonitorActions.loadMonitorData, (state) => {
    console.log('Monitor reducer: loading monitor data');
    return {
      ...state,
      loading: true,
      error: null
    };
  }),
  // Add this after the existing `loadMonitorData` handler:
on(MonitorActions.loadMonitorDataSuccess, (state) => {
  console.log('Monitor reducer: load monitor data success');
  return {
    ...state,
    loading: false,
    error: null
  };
})
);
