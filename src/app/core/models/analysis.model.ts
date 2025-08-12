export interface ChartData {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie';
  data: any[];
}

export interface ChartPosition {
  position: number; // 0 = left, 1 = right, 2 = hidden
  chartType: 'gradesOverTime' | 'studentAverages' | 'subjectAverages';
}

export interface AnalysisState {
  selectedIds: string[];
  selectedSubjects: string[];
  chartPositions: ChartPosition[];
  availableIds: string[];
  availableSubjects: string[];
  loading: boolean;
  error: string | null;
}
