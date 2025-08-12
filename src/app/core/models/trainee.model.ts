export interface Trainee {
  id: string;
  name: string;
  grade: number;
  email: string;
  dateJoined: Date;
  address: string;
  city: string;
  country: string;
  zip: string;
  subject: string;
}

export interface TraineeFilters {
  searchTerm: string;
  subject?: string;
  minGrade?: number;
  maxGrade?: number;
}

export interface TraineeState {
  trainees: Trainee[];
  selectedTrainee: Trainee | null;
  filters: TraineeFilters;
  loading: boolean;
  error: string | null;
}