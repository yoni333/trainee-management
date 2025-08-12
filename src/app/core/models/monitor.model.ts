export interface MonitorTrainee {
  id: string;
  name: string;
  average: number;
  examCount: number;
  status: 'passed' | 'failed';
}

export interface MonitorFilters {
  selectedIds: string[];
  nameSearch: string;
  showPassed: boolean;
  showFailed: boolean;
}

export interface MonitorState {
  filters: MonitorFilters;
  availableIds: string[];
  loading: boolean;
  error: string | null;
}
