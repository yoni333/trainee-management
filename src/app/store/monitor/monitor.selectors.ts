import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MonitorState, MonitorTrainee } from '../../core/models/monitor.model';
import { selectAllTrainees } from '../trainee/trainee.selectors';

export const selectMonitorState = createFeatureSelector<MonitorState>('monitor');

export const selectMonitorFilters = createSelector(
  selectMonitorState,
  (state) => state.filters
);

export const selectSelectedIds = createSelector(
  selectMonitorFilters,
  (filters) => filters.selectedIds
);

export const selectNameSearch = createSelector(
  selectMonitorFilters,
  (filters) => filters.nameSearch
);

export const selectStateFilter = createSelector(
  selectMonitorFilters,
  (filters) => ({ showPassed: filters.showPassed, showFailed: filters.showFailed })
);

export const selectAvailableIds = createSelector(
  selectAllTrainees,
  (trainees) => {
    const ids = [...new Set(trainees.map(t => t.id))];
    console.log('Available IDs:', ids); // Debug log
    return ids;
  }
);

// Process trainees into monitor format with averages and exam counts
export const selectMonitorTrainees = createSelector(
  selectAllTrainees,
  (trainees) => {
    console.log('Processing trainees for monitor:', trainees.length); // Debug log
    
    if (!trainees || trainees.length === 0) {
      console.log('No trainees available for monitor');
      return [];
    }
    
    const traineeMap = new Map<string, { total: number; count: number; name: string }>();
    
    // Calculate averages and exam counts
    trainees.forEach(trainee => {
      const key = trainee.id;
      if (!traineeMap.has(key)) {
        traineeMap.set(key, {
          total: 0,
          count: 0,
          name: trainee.name
        });
      }
      
      const data = traineeMap.get(key)!;
      data.total += trainee.grade;
      data.count += 1;
    });
    
    // Convert to MonitorTrainee format
    const result: MonitorTrainee[] = [];
    traineeMap.forEach((data, id) => {
      const average = Math.round((data.total / data.count) * 100) / 100;
      result.push({
        id,
        name: data.name,
        average,
        examCount: data.count,
        status: average >= 65 ? 'passed' : 'failed'
      });
    });
    
    console.log('Monitor trainees processed:', result.length); // Debug log
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }
);

// Apply all filters to monitor trainees
export const selectFilteredMonitorTrainees = createSelector(
  selectMonitorTrainees,
  selectMonitorFilters,
  (trainees, filters) => {
    console.log('Filtering monitor trainees:', trainees.length, 'with filters:', filters); // Debug log
    
    const filtered = trainees.filter(trainee => {
      // ID filter
      const matchesIds = filters.selectedIds.length === 0 || 
        filters.selectedIds.includes(trainee.id);
      
      // Name search filter
      const matchesName = !filters.nameSearch || 
        trainee.name.toLowerCase().includes(filters.nameSearch.toLowerCase());
      
      // Status filter
      const matchesStatus = 
        (filters.showPassed && trainee.status === 'passed') ||
        (filters.showFailed && trainee.status === 'failed');
      
      return matchesIds && matchesName && matchesStatus;
    });
    
    console.log('Filtered monitor trainees:', filtered.length); // Debug log
    return filtered;
  }
);

// Statistics selectors
export const selectMonitorStats = createSelector(
  selectMonitorTrainees,
  (trainees) => {
    const passed = trainees.filter(t => t.status === 'passed').length;
    const failed = trainees.filter(t => t.status === 'failed').length;
    const total = trainees.length;
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
    
    const stats = {
      total,
      passed,
      failed,
      passRate
    };
    
    console.log('Monitor stats:', stats); // Debug log
    return stats;
  }
);

export const selectMonitorLoading = createSelector(
  selectMonitorState,
  (state) => state?.loading || false
);

export const selectMonitorError = createSelector(
  selectMonitorState,
  (state) => state?.error || null
);
