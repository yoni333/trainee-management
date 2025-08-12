#!/bin/bash

# Trainee Management App Setup Script - Separate Files
# Run this script from your Angular project root directory

set -e  # Exit on any error

echo "🚀 Setting up Trainee Management Application with separate files..."
echo "📁 Creating folder structure..."

# Create the main directory structure
mkdir -p src/app/core/models
mkdir -p src/app/core/services
mkdir -p src/app/shared/modules
mkdir -p src/app/features/data/components/trainee-table
mkdir -p src/app/features/data/components/trainee-detail
mkdir -p src/app/features/data/components/trainee-filter
mkdir -p src/app/features/data/containers/data-page
mkdir -p src/app/features/analysis
mkdir -p src/app/features/monitor
mkdir -p src/app/store/trainee

echo "📝 Creating model files..."

# Create trainee.model.ts
cat > src/app/core/models/trainee.model.ts << 'EOF'
export interface Trainee {
  id: string;
  date: Date;
  name: string;
  grade: number;
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
EOF

echo "🔧 Creating service files..."

# Create trainee.service.ts
cat > src/app/core/services/trainee.service.ts << 'EOF'
import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { Trainee } from '../models/trainee.model';

@Injectable({
  providedIn: 'root'
})
export class TraineeService {
  private mockTrainees: Trainee[] = [
    { id: '1', date: new Date('2024-01-15'), name: 'John Doe', grade: 85, subject: 'Mathematics' },
    { id: '2', date: new Date('2024-01-16'), name: 'Jane Smith', grade: 92, subject: 'Physics' },
    { id: '3', date: new Date('2024-01-17'), name: 'Mike Johnson', grade: 78, subject: 'Chemistry' },
    { id: '4', date: new Date('2024-01-18'), name: 'Sarah Wilson', grade: 95, subject: 'Mathematics' },
    { id: '5', date: new Date('2024-01-19'), name: 'Tom Brown', grade: 88, subject: 'Physics' },
    { id: '6', date: new Date('2024-01-20'), name: 'Lisa Davis', grade: 91, subject: 'Chemistry' },
    { id: '7', date: new Date('2024-01-21'), name: 'Chris Miller', grade: 76, subject: 'Mathematics' },
    { id: '8', date: new Date('2024-01-22'), name: 'Emma Taylor', grade: 89, subject: 'Physics' }
  ];

  getAllTrainees(): Observable<Trainee[]> {
    return of([...this.mockTrainees]).pipe(delay(500));
  }

  addTrainee(trainee: Omit<Trainee, 'id'>): Observable<Trainee> {
    const newTrainee: Trainee = {
      ...trainee,
      id: this.generateId()
    };
    this.mockTrainees.push(newTrainee);
    return of(newTrainee).pipe(delay(300));
  }

  removeTrainee(id: string): Observable<void> {
    const index = this.mockTrainees.findIndex(t => t.id === id);
    if (index > -1) {
      this.mockTrainees.splice(index, 1);
      return of(void 0).pipe(delay(300));
    }
    return throwError(() => new Error('Trainee not found'));
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
EOF

echo "📦 Creating shared modules..."

# Create material.module.ts
cat > src/app/shared/modules/material.module.ts << 'EOF'
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDividerModule } from '@angular/material/divider';

const materialModules = [
  MatTableModule,
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatCardModule,
  MatIconModule,
  MatToolbarModule,
  MatSidenavModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatDialogModule,
  MatListModule,
  MatChipsModule,
  MatProgressBarModule,
  MatPaginatorModule,
  MatSortModule,
  MatDividerModule
];

@NgModule({
  imports: materialModules,
  exports: materialModules
})
export class MaterialModule { }
EOF

echo "🏪 Creating NgRx store files..."

# Create app.state.ts
cat > src/app/store/app.state.ts << 'EOF'
import { TraineeState } from '../core/models/trainee.model';

export interface AppState {
  trainee: TraineeState;
}
EOF

# Create trainee.actions.ts
cat > src/app/store/trainee/trainee.actions.ts << 'EOF'
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Trainee, TraineeFilters } from '../../core/models/trainee.model';

export const TraineeActions = createActionGroup({
  source: 'Trainee',
  events: {
    'Load Trainees': emptyProps(),
    'Load Trainees Success': props<{ trainees: Trainee[] }>(),
    'Load Trainees Failure': props<{ error: string }>(),
    
    'Select Trainee': props<{ trainee: Trainee }>(),
    'Clear Selection': emptyProps(),
    
    'Add Trainee': props<{ trainee: Omit<Trainee, 'id'> }>(),
    'Add Trainee Success': props<{ trainee: Trainee }>(),
    'Add Trainee Failure': props<{ error: string }>(),
    
    'Remove Trainee': props<{ id: string }>(),
    'Remove Trainee Success': props<{ id: string }>(),
    'Remove Trainee Failure': props<{ error: string }>(),
    
    'Update Filters': props<{ filters: Partial<TraineeFilters> }>(),
  }
});
EOF

# Create trainee.reducer.ts
cat > src/app/store/trainee/trainee.reducer.ts << 'EOF'
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
EOF

# Create trainee.selectors.ts
cat > src/app/store/trainee/trainee.selectors.ts << 'EOF'
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
EOF

# Create trainee.effects.ts
cat > src/app/store/trainee/trainee.effects.ts << 'EOF'
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TraineeService } from '../../core/services/trainee.service';
import { TraineeActions } from './trainee.actions';

@Injectable()
export class TraineeEffects {
  private actions$ = inject(Actions);
  private traineeService = inject(TraineeService);

  loadTrainees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TraineeActions.loadTrainees),
      switchMap(() =>
        this.traineeService.getAllTrainees().pipe(
          map(trainees => TraineeActions.loadTraineesSuccess({ trainees })),
          catchError(error => of(TraineeActions.loadTraineesFailure({ error: error.message })))
        )
      )
    )
  );

  addTrainee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TraineeActions.addTrainee),
      switchMap(({ trainee }) =>
        this.traineeService.addTrainee(trainee).pipe(
          map(newTrainee => TraineeActions.addTraineeSuccess({ trainee: newTrainee })),
          catchError(error => of(TraineeActions.addTraineeFailure({ error: error.message })))
        )
      )
    )
  );

  removeTrainee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TraineeActions.removeTrainee),
      switchMap(({ id }) =>
        this.traineeService.removeTrainee(id).pipe(
          map(() => TraineeActions.removeTraineeSuccess({ id })),
          catchError(error => of(TraineeActions.removeTraineeFailure({ error: error.message })))
        )
      )
    )
  );
}
EOF

echo "🎯 Creating filter component..."

# Create trainee-filter.component.ts
cat > src/app/features/data/components/trainee-filter/trainee-filter.component.ts << 'EOF'
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/material.module';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectSelectedTrainee } from '../../../../store/trainee/trainee.selectors';
import { TraineeActions } from '../../../../store/trainee/trainee.actions';

@Component({
  selector: 'app-trainee-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './trainee-filter.component.html',
  styleUrls: ['./trainee-filter.component.scss']
})
export class TraineeFilterComponent {
  @Output() filterChange = new EventEmitter<any>();
  @Output() addTrainee = new EventEmitter<void>();
  @Output() removeTrainee = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private store = inject(Store);

  filterForm: FormGroup;
  selectedTrainee$: Observable<any>;

  constructor() {
    this.filterForm = this.fb.group({
      searchTerm: [''],
      subject: [''],
      minGrade: [''],
      maxGrade: ['']
    });

    this.selectedTrainee$ = this.store.select(selectSelectedTrainee);
  }

  onFilterChange(): void {
    const filters = this.filterForm.value;
    Object.keys(filters).forEach(key => {
      if (filters[key] === '' || filters[key] === null) {
        filters[key] = undefined;
      }
    });
    this.filterChange.emit(filters);
  }

  onAddClick(): void {
    this.addTrainee.emit();
  }

  onRemoveClick(): void {
    this.selectedTrainee$.subscribe(trainee => {
      if (trainee) {
        this.store.dispatch(TraineeActions.removeTrainee({ id: trainee.id }));
      }
    }).unsubscribe();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.onFilterChange();
  }
}
EOF

# Create trainee-filter.component.html
cat > src/app/features/data/components/trainee-filter/trainee-filter.component.html << 'EOF'
<mat-card class="filter-card">
  <mat-card-content>
    <form [formGroup]="filterForm" class="filter-form">
      <!-- Search Input (Large) -->
      <mat-form-field class="search-field" appearance="outline">
        <mat-label>Search trainees...</mat-label>
        <input matInput 
               formControlName="searchTerm" 
               placeholder="Search by name or subject"
               (input)="onFilterChange()">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <!-- Additional Filters -->
      <div class="additional-filters">
        <mat-form-field appearance="outline">
          <mat-label>Subject</mat-label>
          <mat-select formControlName="subject" (selectionChange)="onFilterChange()">
            <mat-option value="">All Subjects</mat-option>
            <mat-option value="Mathematics">Mathematics</mat-option>
            <mat-option value="Physics">Physics</mat-option>
            <mat-option value="Chemistry">Chemistry</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Min Grade</mat-label>
          <input matInput 
                 type="number" 
                 formControlName="minGrade" 
                 min="0" 
                 max="100"
                 (input)="onFilterChange()">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Max Grade</mat-label>
          <input matInput 
                 type="number" 
                 formControlName="maxGrade" 
                 min="0" 
                 max="100"
                 (input)="onFilterChange()">
        </mat-form-field>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button mat-raised-button 
                color="primary" 
                (click)="onAddClick()">
          <mat-icon>add</mat-icon>
          Add Trainee
        </button>
        
        <button mat-raised-button 
                color="warn" 
                [disabled]="!(selectedTrainee$ | async)"
                (click)="onRemoveClick()">
          <mat-icon>delete</mat-icon>
          Remove Selected
        </button>

        <button mat-button 
                (click)="clearFilters()">
          <mat-icon>clear</mat-icon>
          Clear Filters
        </button>
      </div>
    </form>
  </mat-card-content>
</mat-card>
EOF

# Create trainee-filter.component.scss
cat > src/app/features/data/components/trainee-filter/trainee-filter.component.scss << 'EOF'
.filter-card {
  margin-bottom: 0;
}

.filter-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-field {
  width: 100%;
  font-size: 18px;
}

.search-field ::ng-deep .mat-mdc-form-field-input-control {
  font-size: 18px;
  padding: 12px 0;
}

.additional-filters {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
}

.additional-filters mat-form-field {
  min-width: 150px;
  flex: 1;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.action-buttons button {
  min-width: 120px;
}

@media (max-width: 768px) {
  .additional-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .additional-filters mat-form-field {
    min-width: unset;
  }

  .action-buttons {
    flex-direction: column;
    align-items: stretch;
  }
}
EOF

# Create trainee-filter.component.spec.ts
cat > src/app/features/data/components/trainee-filter/trainee-filter.component.spec.ts << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TraineeFilterComponent } from './trainee-filter.component';

describe('TraineeFilterComponent', () => {
  let component: TraineeFilterComponent;
  let fixture: ComponentFixture<TraineeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraineeFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraineeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF

echo "📊 Creating table component..."

# Create trainee-table.component.ts
cat > src/app/features/data/components/trainee-table/trainee-table.component.ts << 'EOF'
import { Component, Input, Output, EventEmitter, ViewChild, OnChanges, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/modules/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Trainee } from '../../../../core/models/trainee.model';

@Component({
  selector: 'app-trainee-table',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './trainee-table.component.html',
  styleUrls: ['./trainee-table.component.scss']
})
export class TraineeTableComponent implements OnChanges, AfterViewInit {
  @Input() trainees: Trainee[] | null = [];
  @Input() loading: boolean | null = false;
  @Input() selectedTrainee: Trainee | null = null;
  @Output() traineeSelected = new EventEmitter<Trainee>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['id', 'date', 'name', 'grade', 'subject'];
  dataSource = new MatTableDataSource<Trainee>([]);

  ngOnChanges(): void {
    if (this.trainees) {
      this.dataSource.data = this.trainees;
      
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  selectTrainee(trainee: Trainee): void {
    this.traineeSelected.emit(trainee);
  }

  isSelected(trainee: Trainee): boolean {
    return this.selectedTrainee?.id === trainee.id;
  }

  getGradeClass(grade: number): string {
    if (grade >= 90) return 'grade-excellent';
    if (grade >= 75) return 'grade-good';
    return 'grade-needs-improvement';
  }

  getSubjectColor(subject: string): 'primary' | 'accent' | 'warn' {
    switch (subject) {
      case 'Mathematics': return 'primary';
      case 'Physics': return 'accent';
      case 'Chemistry': return 'warn';
      default: return 'primary';
    }
  }
}
EOF

# Create trainee-table.component.html
cat > src/app/features/data/components/trainee-table/trainee-table.component.html << 'EOF'
<div class="table-container">
  <!-- Loading Spinner -->
  <div *ngIf="loading" class="loading-container">
    <mat-spinner diameter="50"></mat-spinner>
    <p>Loading trainees...</p>
  </div>

  <!-- Table -->
  <div *ngIf="!loading" class="table-wrapper">
    <table mat-table 
           [dataSource]="dataSource" 
           matSort 
           class="trainee-table">
      
      <!-- ID Column -->
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
        <td mat-cell *matCellDef="let trainee">{{trainee.id}}</td>
      </ng-container>

      <!-- Date Column -->
      <ng-container matColumnDef="date">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
        <td mat-cell *matCellDef="let trainee">{{trainee.date | date:'shortDate'}}</td>
      </ng-container>

      <!-- Name Column -->
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
        <td mat-cell *matCellDef="let trainee">{{trainee.name}}</td>
      </ng-container>

      <!-- Grade Column -->
      <ng-container matColumnDef="grade">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Grade</th>
        <td mat-cell *matCellDef="let trainee">
          <span [ngClass]="getGradeClass(trainee.grade)">
            {{trainee.grade}}
          </span>
        </td>
      </ng-container>

      <!-- Subject Column -->
      <ng-container matColumnDef="subject">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Subject</th>
        <td mat-cell *matCellDef="let trainee">
          <mat-chip [color]="getSubjectColor(trainee.subject)">
            {{trainee.subject}}
          </mat-chip>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row 
          *matRowDef="let row; columns: displayedColumns;"
          [class.selected-row]="isSelected(row)"
          (click)="selectTrainee(row)"
          class="clickable-row">
      </tr>
    </table>

    <!-- Paginator -->
    <mat-paginator 
      [pageSizeOptions]="[5, 10, 25, 50]"
      [pageSize]="10"
      showFirstLastButtons>
    </mat-paginator>
  </div>

  <!-- No Data Message -->
  <div *ngIf="!loading && dataSource.data.length === 0" class="no-data">
    <mat-icon>inbox</mat-icon>
    <p>No trainees found</p>
  </div>
</div>
EOF

# Create trainee-table.component.scss
cat > src/app/features/data/components/trainee-table/trainee-table.component.scss << 'EOF'
.table-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  flex: 1;
}

.loading-container p {
  margin-top: 16px;
  color: #666;
}

.table-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.trainee-table {
  flex: 1;
  width: 100%;
}

.clickable-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.clickable-row:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.selected-row {
  background-color: rgba(63, 81, 181, 0.1) !important;
}

.grade-excellent {
  color: #4caf50;
  font-weight: bold;
}

.grade-good {
  color: #ff9800;
  font-weight: bold;
}

.grade-needs-improvement {
  color: #f44336;
  font-weight: bold;
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  flex: 1;
  color: #666;
}

.no-data mat-icon {
  font-size: 48px;
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
}

mat-paginator {
  border-top: 1px solid #e0e0e0;
  margin-top: auto;
}

mat-chip {
  font-size: 12px;
}
EOF

# Create trainee-table.component.spec.ts
cat > src/app/features/data/components/trainee-table/trainee-table.component.spec.ts << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TraineeTableComponent } from './trainee-table.component';

describe('TraineeTableComponent', () => {
  let component: TraineeTableComponent;
  let fixture: ComponentFixture<TraineeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraineeTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraineeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF

echo "📋 Creating detail component..."

# Create trainee-detail.component.ts
cat > src/app/features/data/components/trainee-detail/trainee-detail.component.ts << 'EOF'
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/modules/material.module';
import { Trainee } from '../../../../core/models/trainee.model';

@Component({
  selector: 'app-trainee-detail',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './trainee-detail.component.html',
  styleUrls: ['./trainee-detail.component.scss']
})
export class TraineeDetailComponent {
  @Input() trainee: Trainee | null = null;

  getGradeClass(grade: number): string {
    if (grade >= 90) return 'grade-excellent';
    if (grade >= 75) return 'grade-good';
    return 'grade-needs-improvement';
  }

  getGradeProgressColor(grade: number): 'primary' | 'accent' | 'warn' {
    if (grade >= 90) return 'primary';
    if (grade >= 75) return 'accent';
    return 'warn';
  }

  getSubjectColor(subject: string): 'primary' | 'accent' | 'warn' {
    switch (subject) {
      case 'Mathematics': return 'primary';
      case 'Physics': return 'accent';
      case 'Chemistry': return 'warn';
      default: return 'primary';
    }
  }

  getPerformanceIcon(grade: number): string {
    if (grade >= 90) return 'star';
    if (grade >= 75) return 'thumb_up';
    return 'trending_up';
  }

  getPerformanceIconClass(grade: number): string {
    if (grade >= 90) return 'icon-excellent';
    if (grade >= 75) return 'icon-good';
    return 'icon-needs-improvement';
  }

  getPerformanceText(grade: number): string {
    if (grade >= 90) return 'Excellent Performance';
    if (grade >= 75) return 'Good Performance';
    return 'Needs Improvement';
  }
}
EOF

# Create trainee-detail.component.html
cat > src/app/features/data/components/trainee-detail/trainee-detail.component.html << 'EOF'
<mat-card class="detail-card">
  <mat-card-header>
    <mat-card-title>
      <mat-icon>person</mat-icon>
      Trainee Details
    </mat-card-title>
  </mat-card-header>
  
  <mat-card-content>
    <div *ngIf="trainee; else noSelection" class="trainee-details">
      <!-- Profile Section -->
      <div class="profile-section">
        <div class="avatar">
          <mat-icon>account_circle</mat-icon>
        </div>
        <h3>{{trainee.name}}</h3>
      </div>

      <!-- Details List -->
      <mat-list class="details-list">
        <mat-list-item>
          <mat-icon matListItemIcon>tag</mat-icon>
          <div matListItemTitle>ID</div>
          <div matListItemLine>{{trainee.id}}</div>
        </mat-list-item>
        
        <mat-divider></mat-divider>
        
        <mat-list-item>
          <mat-icon matListItemIcon>calendar_today</mat-icon>
          <div matListItemTitle>Date</div>
          <div matListItemLine>{{trainee.date | date:'fullDate'}}</div>
        </mat-list-item>
        
        <mat-divider></mat-divider>
        
        <mat-list-item>
          <mat-icon matListItemIcon>school</mat-icon>
          <div matListItemTitle>Subject</div>
          <div matListItemLine>
            <mat-chip [color]="getSubjectColor(trainee.subject)">
              {{trainee.subject}}
            </mat-chip>
          </div>
        </mat-list-item>
        
        <mat-divider></mat-divider>
        
        <mat-list-item>
          <mat-icon matListItemIcon>grade</mat-icon>
          <div matListItemTitle>Grade</div>
          <div matListItemLine>
            <div class="grade-display">
              <span [ngClass]="getGradeClass(trainee.grade)" class="grade-value">
                {{trainee.grade}}
              </span>
              <mat-progress-bar 
                [value]="trainee.grade" 
                [color]="getGradeProgressColor(trainee.grade)"
                class="grade-progress">
              </mat-progress-bar>
            </div>
          </div>
        </mat-list-item>
      </mat-list>

      <!-- Performance Indicator -->
      <div class="performance-section">
        <h4>Performance Level</h4>
        <div class="performance-indicator">
          <mat-icon [ngClass]="getPerformanceIconClass(trainee.grade)">
            {{getPerformanceIcon(trainee.grade)}}
          </mat-icon>
          <span [ngClass]="getGradeClass(trainee.grade)">
            {{getPerformanceText(trainee.grade)}}
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions-section">
        <button mat-stroked-button color="primary" class="action-btn">
          <mat-icon>edit</mat-icon>
          Edit
        </button>
        <button mat-stroked-button color="accent" class="action-btn">
          <mat-icon>visibility</mat-icon>
          View Full Profile
        </button>
      </div>
    </div>

    <ng-template #noSelection>
      <div class="no-selection">
        <mat-icon>touch_app</mat-icon>
        <p>Select a trainee from the table to view details</p>
      </div>
    </ng-template>
  </mat-card-content>
</mat-card>
EOF

# Create trainee-detail.component.scss
cat > src/app/features/data/components/trainee-detail/trainee-detail.component.scss << 'EOF'
.detail-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.detail-card mat-card-content {
  flex: 1;
  padding: 0;
}

.trainee-details {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.profile-section {
  text-align: center;
  padding: 20px 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;
}

.avatar {
  margin-bottom: 12px;
}

.avatar mat-icon {
  font-size: 64px;
  width: 64px;
  height: 64px;
  color: #666;
}

.profile-section h3 {
  margin: 0;
  color: #333;
}

.details-list {
  flex: 1;
  padding: 0;
}

.details-list mat-list-item {
  padding: 12px 0;
}

.grade-display {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.grade-value {
  font-weight: bold;
  font-size: 18px;
  min-width: 40px;
}

.grade-progress {
  flex: 1;
  height: 8px;
  border-radius: 4px;
}

.grade-excellent {
  color: #4caf50;
}

.grade-good {
  color: #ff9800;
}

.grade-needs-improvement {
  color: #f44336;
}

.performance-section {
  margin: 20px 0;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.performance-section h4 {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.performance-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.performance-indicator mat-icon {
  font-size: 20px;
  width: 20px;
  height: 20px;
}

.icon-excellent {
  color: #4caf50;
}

.icon-good {
  color: #ff9800;
}

.icon-needs-improvement {
  color: #f44336;
}

.actions-section {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-btn {
  width: 100%;
}

.no-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  text-align: center;
  padding: 40px 20px;
}

.no-selection mat-icon {
  font-size: 48px;
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  color: #ccc;
}

.no-selection p {
  margin: 0;
  line-height: 1.5;
}

mat-chip {
  font-size: 12px;
}
EOF

# Create trainee-detail.component.spec.ts
cat > src/app/features/data/components/trainee-detail/trainee-detail.component.spec.ts << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TraineeDetailComponent } from './trainee-detail.component';

describe('TraineeDetailComponent', () => {
  let component: TraineeDetailComponent;
  let fixture: ComponentFixture<TraineeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraineeDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraineeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF

echo "📄 Creating data page container..."

# Create data-page.component.ts
cat > src/app/features/data/containers/data-page/data-page.component.ts << 'EOF'
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MaterialModule } from '../../../../shared/modules/material.module';
import { TraineeTableComponent } from '../../components/trainee-table/trainee-table.component';
import { TraineeDetailComponent } from '../../components/trainee-detail/trainee-detail.component';
import { TraineeFilterComponent } from '../../components/trainee-filter/trainee-filter.component';
import { Trainee } from '../../../../core/models/trainee.model';
import { TraineeActions } from '../../../../store/trainee/trainee.actions';
import { selectFilteredTrainees, selectSelectedTrainee, selectLoading } from '../../../../store/trainee/trainee.selectors';

@Component({
  selector: 'app-data-page',
  standalone: true,
  imports: [
    CommonModule, 
    MaterialModule,
    TraineeTableComponent,
    TraineeDetailComponent,
    TraineeFilterComponent
  ],
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.scss']
})
export class DataPageComponent implements OnInit {
  private store = inject(Store);

  filteredTrainees$: Observable<Trainee[]>;
  selectedTrainee$: Observable<Trainee | null>;
  loading$: Observable<boolean>;

  constructor() {
    this.filteredTrainees$ = this.store.select(selectFilteredTrainees);
    this.selectedTrainee$ = this.store.select(selectSelectedTrainee);
    this.loading$ = this.store.select(selectLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(TraineeActions.loadTrainees());
  }

  onFilterChange(filters: any): void {
    this.store.dispatch(TraineeActions.updateFilters({ filters }));
  }

  onTraineeSelected(trainee: Trainee): void {
    this.store.dispatch(TraineeActions.selectTrainee({ trainee }));
  }

  onAddTrainee(): void {
    const newTrainee = {
      date: new Date(),
      name: 'New Trainee',
      grade: 0,
      subject: 'Mathematics'
    };
    this.store.dispatch(TraineeActions.addTrainee({ trainee: newTrainee }));
  }

  onRemoveSelectedTrainee(): void {
    // Implementation handled by the filter component
  }
}
EOF

# Create data-page.component.html
cat > src/app/features/data/containers/data-page/data-page.component.html << 'EOF'
<div class="data-page-container">
  <!-- Filter and Action Bar -->
  <div class="action-bar">
    <app-trainee-filter 
      (filterChange)="onFilterChange($event)"
      (addTrainee)="onAddTrainee()"
      (removeTrainee)="onRemoveSelectedTrainee()">
    </app-trainee-filter>
  </div>

  <!-- Main Content Area -->
  <div class="content-area">
    <!-- Table Section (80% width) -->
    <div class="table-section">
      <mat-card>
        <mat-card-content>
          <app-trainee-table
            [trainees]="filteredTrainees$ | async"
            [loading]="loading$ | async"
            [selectedTrainee]="selectedTrainee$ | async"
            (traineeSelected)="onTraineeSelected($event)">
          </app-trainee-table>
        </mat-card-content>
      </mat-card>
    </div>

    <!-- Detail Panel (20% width) -->
    <div class="detail-section">
      <app-trainee-detail
        [trainee]="selectedTrainee$ | async">
      </app-trainee-detail>
    </div>
  </div>
</div>
EOF

# Create data-page.component.scss
cat > src/app/features/data/containers/data-page/data-page.component.scss << 'EOF'
.data-page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.action-bar {
  flex-shrink: 0;
}

.content-area {
  flex: 1;
  display: flex;
  gap: 20px;
  min-height: 0;
}

.table-section {
  flex: 0 0 80%;
  display: flex;
  flex-direction: column;
}

.table-section mat-card {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.table-section mat-card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
}

.detail-section {
  flex: 0 0 20%;
  min-width: 250px;
}

@media (max-width: 768px) {
  .content-area {
    flex-direction: column;
  }
  .table-section,
  .detail-section {
    flex: 1 1 auto;
  }
}
EOF

# Create data-page.component.spec.ts
cat > src/app/features/data/containers/data-page/data-page.component.spec.ts << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataPageComponent } from './data-page.component';

describe('DataPageComponent', () => {
  let component: DataPageComponent;
  let fixture: ComponentFixture<DataPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF

echo "📊 Creating analysis component..."

# Create analysis.component.ts
cat > src/app/features/analysis/analysis.component.ts << 'EOF'
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/modules/material.module';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent {}
EOF

# Create analysis.component.html
cat > src/app/features/analysis/analysis.component.html << 'EOF'
<div class="analysis-container">
  <mat-card>
    <mat-card-header>
      <mat-card-title>
        <mat-icon>analytics</mat-icon>
        Analysis Dashboard
      </mat-card-title>
      <mat-card-subtitle>
        Coming Soon - Trainee Performance Analytics
      </mat-card-subtitle>
    </mat-card-header>
    <mat-card-content>
      <div class="placeholder-content">
        <mat-icon>bar_chart</mat-icon>
        <h2>Analysis Page</h2>
        <p>This page will contain:</p>
        <ul>
          <li>Performance trend charts</li>
          <li>Subject-wise grade distributions</li>
          <li>Comparative analysis</li>
          <li>Statistical insights</li>
        </ul>
      </div>
    </mat-card-content>
  </mat-card>
</div>
EOF

# Create analysis.component.scss
cat > src/app/features/analysis/analysis.component.scss << 'EOF'
.analysis-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.placeholder-content {
  text-align: center;
  padding: 60px 20px;
}

.placeholder-content mat-icon {
  font-size: 72px;
  width: 72px;
  height: 72px;
  color: #666;
  margin-bottom: 20px;
}

.placeholder-content h2 {
  margin: 20px 0;
  color: #333;
}

.placeholder-content ul {
  text-align: left;
  max-width: 300px;
  margin: 20px auto;
}

.placeholder-content li {
  margin: 8px 0;
  color: #666;
}
EOF

# Create analysis.component.spec.ts
cat > src/app/features/analysis/analysis.component.spec.ts << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalysisComponent } from './analysis.component';

describe('AnalysisComponent', () => {
  let component: AnalysisComponent;
  let fixture: ComponentFixture<AnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF

echo "📺 Creating monitor component..."

# Create monitor.component.ts
cat > src/app/features/monitor/monitor.component.ts << 'EOF'
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/modules/material.module';

@Component({
  selector: 'app-monitor',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss']
})
export class MonitorComponent {}
EOF

# Create monitor.component.html
cat > src/app/features/monitor/monitor.component.html << 'EOF'
<div class="monitor-container">
  <mat-card>
    <mat-card-header>
      <mat-card-title>
        <mat-icon>monitor</mat-icon>
        Monitoring Dashboard
      </mat-card-title>
      <mat-card-subtitle>
        Coming Soon - Real-time Trainee Monitoring
      </mat-card-subtitle>
    </mat-card-header>
    <mat-card-content>
      <div class="placeholder-content">
        <mat-icon>timeline</mat-icon>
        <h2>Monitor Page</h2>
        <p>This page will contain:</p>
        <ul>
          <li>Real-time activity tracking</li>
          <li>Live performance monitoring</li>
          <li>Alert notifications</li>
          <li>Progress tracking dashboards</li>
        </ul>
      </div>
    </mat-card-content>
  </mat-card>
</div>
EOF

# Create monitor.component.scss
cat > src/app/features/monitor/monitor.component.scss << 'EOF'
.monitor-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.placeholder-content {
  text-align: center;
  padding: 60px 20px;
}

.placeholder-content mat-icon {
  font-size: 72px;
  width: 72px;
  height: 72px;
  color: #666;
  margin-bottom: 20px;
}

.placeholder-content h2 {
  margin: 20px 0;
  color: #333;
}

.placeholder-content ul {
  text-align: left;
  max-width: 300px;
  margin: 20px auto;
}

.placeholder-content li {
  margin: 8px 0;
  color: #666;
}
EOF

# Create monitor.component.spec.ts
cat > src/app/features/monitor/monitor.component.spec.ts << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonitorComponent } from './monitor.component';

describe('MonitorComponent', () => {
  let component: MonitorComponent;
  let fixture: ComponentFixture<MonitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonitorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF

echo "🏠 Creating main app component..."

# Create app.component.ts
cat > src/app/app.component.ts << 'EOF'
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './shared/modules/material.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'trainee-management';
}
EOF

# Create app.component.html
cat > src/app/app.component.html << 'EOF'
<mat-toolbar color="primary">
  <mat-toolbar-row>
    <span>Trainee Management System</span>
    <span class="spacer"></span>
    <nav>
      <a mat-button routerLink="/data" routerLinkActive="active">Data</a>
      <a mat-button routerLink="/analysis" routerLinkActive="active">Analysis</a>
      <a mat-button routerLink="/monitor" routerLinkActive="active">Monitor</a>
    </nav>
  </mat-toolbar-row>
</mat-toolbar>
<main class="main-content">
  <router-outlet></router-outlet>
</main>
EOF

# Create app.component.scss
cat > src/app/app.component.scss << 'EOF'
.spacer {
  flex: 1 1 auto;
}
.main-content {
  padding: 20px;
  height: calc(100vh - 64px);
  overflow: auto;
}
nav a {
  margin-left: 16px;
}
nav a.active {
  background-color: rgba(255, 255, 255, 0.1);
}
EOF

# Create app.component.spec.ts
cat > src/app/app.component.spec.ts << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'trainee-management'`, () => {
    expect(component.title).toEqual('trainee-management');
  });
});
EOF

echo "🛣️ Creating routes..."

# Create app.routes.ts
cat > src/app/app.routes.ts << 'EOF'
import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/data', 
    pathMatch: 'full' 
  },
  { 
    path: 'data', 
    loadComponent: () => import('./features/data/containers/data-page/data-page.component')
      .then(c => c.DataPageComponent),
    title: 'Data Management'
  },
  { 
    path: 'analysis', 
    loadComponent: () => import('./features/analysis/analysis.component')
      .then(c => c.AnalysisComponent),
    title: 'Performance Analysis'
  },
  { 
    path: 'monitor', 
    loadComponent: () => import('./features/monitor/monitor.component')
      .then(c => c.MonitorComponent),
    title: 'Monitoring Dashboard'
  },
  {
    path: '**',
    redirectTo: '/data'
  }
];
EOF

echo "🚀 Creating main.ts..."

# Create main.ts
cat > src/main.ts << 'EOF'
import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { isDevMode } from '@angular/core';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { traineeReducer } from './app/store/trainee/trainee.reducer';
import { TraineeEffects } from './app/store/trainee/trainee.effects';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideStore({ trainee: traineeReducer }),
    provideEffects([TraineeEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75
    })
  ]
}).catch(err => console.error(err));
EOF

echo ""
echo "✅ Setup complete!"
echo ""
echo "📁 Traditional file structure created with separate files:"
echo "   • .ts files (TypeScript logic) - KEPT standalone: true"
echo "   • .html files (Templates)"
echo "   • .scss files (Styles)"
echo "   • .spec.ts files (Tests)"
echo ""
echo "🔄 Next steps:"
echo "1. Run: npm install @ngrx/store @ngrx/effects @ngrx/store-devtools"
echo "2. Run: npm run start"
echo "3. Open: http://localhost:4200"
echo ""
echo "🎉 Your Trainee Management App is ready with separate files!"
echo ""
echo "💡 Features included:"
echo "   • 80/20 layout (table/detail panel)"
echo "   • Advanced filtering system"
echo "   • Add/Remove functionality"
echo "   • NgRx state management"
echo "   • Material Design components"
echo "   • Responsive design"
echo "   • Separate HTML, SCSS, and spec files"
echo "   • SOLID principles architecture"