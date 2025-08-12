import { TraineeState } from '../core/models/trainee.model';
import { AnalysisState } from '../core/models/analysis.model';
import { MonitorState } from '../core/models/monitor.model';

export interface AppState {
  trainee: TraineeState;
  analysis: AnalysisState;
  monitor: MonitorState;
}
