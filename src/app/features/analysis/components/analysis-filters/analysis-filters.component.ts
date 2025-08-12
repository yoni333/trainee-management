import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AnalysisActions } from '../../../../store/analysis/analysis.actions';
import { 
  selectAvailableIds, 
  selectAvailableSubjects, 
  selectSelectedIds, 
  selectSelectedSubjects 
} from '../../../../store/analysis/analysis.selectors';

@Component({
  selector: 'app-analysis-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  template: `
    <mat-card class="filters-card">
      <mat-card-content>
        <div class="filters-container">
          <!-- IDs Filter -->
          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>IDs</mat-label>
            <mat-select 
              multiple 
              [value]="selectedIds$ | async"
              (selectionChange)="onIdsChange($event.value)"
              placeholder="Select trainee IDs">
              <mat-option *ngFor="let id of availableIds$ | async" [value]="id">
                {{id}}
              </mat-option>
            </mat-select>
            <mat-hint>Select trainee IDs for Charts 1 & 2</mat-hint>
          </mat-form-field>

          <!-- Subjects Filter -->
          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Subjects</mat-label>
            <mat-select 
              multiple 
              [value]="selectedSubjects$ | async"
              (selectionChange)="onSubjectsChange($event.value)"
              placeholder="Select subjects">
              <mat-option *ngFor="let subject of availableSubjects$ | async" [value]="subject">
                {{subject}}
              </mat-option>
            </mat-select>
            <mat-hint>Select subjects for Chart 3</mat-hint>
          </mat-form-field>

          <!-- Action Buttons -->
          <div class="filter-actions">
            <button 
              mat-raised-button 
              color="primary"
              (click)="selectAllIds()"
              [disabled]="isAllIdsSelected()">
              <mat-icon>select_all</mat-icon>
              All IDs
            </button>
            
            <button 
              mat-raised-button 
              color="primary"
              (click)="selectAllSubjects()"
              [disabled]="isAllSubjectsSelected()">
              <mat-icon>select_all</mat-icon>
              All Subjects
            </button>
            
            <button 
              mat-button 
              color="warn"
              (click)="clearFilters()">
              <mat-icon>clear</mat-icon>
              Clear All
            </button>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .filters-card {
      margin-bottom: 20px;
    }

    .filters-container {
      display: flex;
      gap: 20px;
      align-items: flex-start;
      flex-wrap: wrap;
    }

    .filter-field {
      min-width: 200px;
      flex: 1;
    }

    .filter-actions {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
      margin-top: 8px;
    }

    @media (max-width: 768px) {
      .filters-container {
        flex-direction: column;
        align-items: stretch;
      }
      
      .filter-field {
        min-width: unset;
      }
      
      .filter-actions {
        justify-content: center;
        margin-top: 16px;
      }
    }

    mat-hint {
      font-size: 12px;
    }
  `]
})
export class AnalysisFiltersComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private destroy$ = new Subject<void>();

  availableIds$: Observable<string[]>;
  availableSubjects$: Observable<string[]>;
  selectedIds$: Observable<string[]>;
  selectedSubjects$: Observable<string[]>;

  private allIds: string[] = [];
  private allSubjects: string[] = [];
  private currentSelectedIds: string[] = [];
  private currentSelectedSubjects: string[] = [];

  constructor() {
    this.availableIds$ = this.store.select(selectAvailableIds);
    this.availableSubjects$ = this.store.select(selectAvailableSubjects);
    this.selectedIds$ = this.store.select(selectSelectedIds);
    this.selectedSubjects$ = this.store.select(selectSelectedSubjects);
  }

  ngOnInit(): void {
    // Subscribe to available options
    this.availableIds$.pipe(takeUntil(this.destroy$)).subscribe(ids => {
      this.allIds = ids;
    });

    this.availableSubjects$.pipe(takeUntil(this.destroy$)).subscribe(subjects => {
      this.allSubjects = subjects;
    });

    // Subscribe to current selections
    this.selectedIds$.pipe(takeUntil(this.destroy$)).subscribe(ids => {
      this.currentSelectedIds = ids;
    });

    this.selectedSubjects$.pipe(takeUntil(this.destroy$)).subscribe(subjects => {
      this.currentSelectedSubjects = subjects;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onIdsChange(selectedIds: string[]): void {
    this.store.dispatch(AnalysisActions.updateSelectedIDs({ selectedIds }));
  }

  onSubjectsChange(selectedSubjects: string[]): void {
    this.store.dispatch(AnalysisActions.updateSelectedSubjects({ selectedSubjects }));
  }

  selectAllIds(): void {
    this.store.dispatch(AnalysisActions.updateSelectedIDs({ selectedIds: [...this.allIds] }));
  }

  selectAllSubjects(): void {
    this.store.dispatch(AnalysisActions.updateSelectedSubjects({ selectedSubjects: [...this.allSubjects] }));
  }

  clearFilters(): void {
    this.store.dispatch(AnalysisActions.resetFilters());
  }

  isAllIdsSelected(): boolean {
    return this.currentSelectedIds.length === this.allIds.length;
  }

  isAllSubjectsSelected(): boolean {
    return this.currentSelectedSubjects.length === this.allSubjects.length;
  }
}
