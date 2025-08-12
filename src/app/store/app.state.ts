import { TraineeState } from '../core/models/trainee.model';
import { AnalysisState } from '../core/models/analysis.model';

export interface AppState {
  trainee: TraineeState;
  analysis: AnalysisState;
}
