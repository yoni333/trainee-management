import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { Store } from '@ngrx/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';

import { MonitorActions } from '../../store/monitor/monitor.actions';
import { TraineeActions } from '../../store/trainee/trainee.actions';
import { selectLoading as selectTraineeLoading, selectAllTrainees } from '../../store/trainee/trainee.selectors';
import {
  selectFilteredMonitorTrainees,
  selectAvailableIds,
  selectMonitorFilters,
  selectMonitorStats,
  selectMonitorLoading,
  selectMonitorTrainees
} from '../../store/monitor/monitor.selectors';
import { MonitorTrainee, MonitorFilters } from '../../core/models/monitor.model';

@Component({
  selector: 'app-monitor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss']
})
export class MonitorComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  // Observables
  filteredTrainees$: Observable<MonitorTrainee[]>;
  availableIds$: Observable<string[]>;
  filters$: Observable<MonitorFilters>;
  stats$: Observable<any>;
  loading$: Observable<boolean>;

  // Debug observables
  allTrainees$: Observable<any[]>;
  monitorTrainees$: Observable<MonitorTrainee[]>;

  // Form
  filterForm: FormGroup;

  // Table configuration
  displayedColumns: string[] = ['id', 'name', 'average', 'examCount', 'status'];
  
  // Current data for template
  currentFilters: MonitorFilters = {
    selectedIds: [],
    nameSearch: '',
    showPassed: true,
    showFailed: true
  };

  // Debug data
  debugInfo = {
    allTraineesCount: 0,
    monitorTraineesCount: 0,
    filteredTraineesCount: 0,
    loading: false
  };

  constructor() {
    console.log('🏗️ Monitor component constructing...');
    
    // Initialize observables with debugging
    this.allTrainees$ = this.store.select(selectAllTrainees).pipe(
      tap(trainees => {
        console.log('📊 All trainees from store:', trainees?.length || 0, trainees);
        this.debugInfo.allTraineesCount = trainees?.length || 0;
      })
    );

    this.monitorTrainees$ = this.store.select(selectMonitorTrainees).pipe(
      tap(trainees => {
        console.log('🔄 Monitor trainees processed:', trainees?.length || 0, trainees);
        this.debugInfo.monitorTraineesCount = trainees?.length || 0;
      })
    );

    this.filteredTrainees$ = this.store.select(selectFilteredMonitorTrainees).pipe(
      tap(trainees => {
        console.log('🔍 Filtered monitor trainees:', trainees?.length || 0, trainees);
        this.debugInfo.filteredTraineesCount = trainees?.length || 0;
      })
    );
    
    this.availableIds$ = this.store.select(selectAvailableIds).pipe(
      tap(ids => console.log('🆔 Available IDs:', ids))
    );
    
    this.filters$ = this.store.select(selectMonitorFilters).pipe(
      tap(filters => console.log('🔧 Current filters:', filters))
    );
    
    this.stats$ = this.store.select(selectMonitorStats).pipe(
      tap(stats => console.log('📈 Monitor stats:', stats))
    );
    
    // Combine loading states
    this.loading$ = combineLatest([
      this.store.select(selectTraineeLoading),
      this.store.select(selectMonitorLoading)
    ]).pipe(
      map(([traineeLoading, monitorLoading]) => {
        const isLoading = traineeLoading || monitorLoading;
        console.log('⏳ Loading states - Trainee:', traineeLoading, 'Monitor:', monitorLoading, 'Combined:', isLoading);
        this.debugInfo.loading = isLoading;
        return isLoading;
      }),
      startWith(true)
    );

    // Initialize form
    this.filterForm = this.fb.group({
      selectedIds: [[]],
      nameSearch: [''],
      showPassed: [true],
      showFailed: [true]
    });
  }

  ngOnInit(): void {
    console.log('🚀 Monitor component initializing...');
    
    // Dispatch actions to load data
    console.log('📡 Dispatching load trainees action...');
    this.store.dispatch(TraineeActions.loadTrainees());
    
    console.log('📡 Dispatching load monitor data action...');
    this.store.dispatch(MonitorActions.loadMonitorData());

    // Subscribe to filters
    this.filters$.pipe(takeUntil(this.destroy$)).subscribe(filters => {
      console.log('🔧 Filters subscription update:', filters);
      this.currentFilters = filters;
      this.filterForm.patchValue(filters, { emitEvent: false });
    });

    // Setup form subscriptions
    this.setupFormSubscriptions();

    // Debug: Subscribe to all key observables
    this.setupDebugSubscriptions();
  }

  ngOnDestroy(): void {
    console.log('🛑 Monitor component destroying...');
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupDebugSubscriptions(): void {
    // Log when data changes
    this.allTrainees$.pipe(takeUntil(this.destroy$)).subscribe();
    this.monitorTrainees$.pipe(takeUntil(this.destroy$)).subscribe();
    this.filteredTrainees$.pipe(takeUntil(this.destroy$)).subscribe();
    this.loading$.pipe(takeUntil(this.destroy$)).subscribe();
  }

  private setupFormSubscriptions(): void {
    // IDs filter
    this.filterForm.get('selectedIds')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedIds => {
        console.log('🆔 IDs filter changed:', selectedIds);
        this.store.dispatch(MonitorActions.updateSelectedIDs({ selectedIds }));
      });

    // Name search with debouncing
    this.filterForm.get('nameSearch')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(nameSearch => {
        console.log('🔍 Name search changed:', nameSearch);
        this.store.dispatch(MonitorActions.updateNameSearch({ nameSearch }));
      });

    // Status filters
    combineLatest([
      this.filterForm.get('showPassed')?.valueChanges || [],
      this.filterForm.get('showFailed')?.valueChanges || []
    ]).pipe(takeUntil(this.destroy$))
      .subscribe(([showPassed, showFailed]) => {
        console.log('✅❌ Status filters changed:', { showPassed, showFailed });
        this.store.dispatch(MonitorActions.updateStateFilter({ showPassed, showFailed }));
      });
  }

  // Template helper methods
  getStatusIcon(status: 'passed' | 'failed'): string {
    return status === 'passed' ? 'check_circle' : 'cancel';
  }

  getStatusClass(status: 'passed' | 'failed'): string {
    return status === 'passed' ? 'status-passed' : 'status-failed';
  }

  getRowClass(trainee: MonitorTrainee): string {
    return `row-${trainee.status}`;
  }

  clearFilters(): void {
    console.log('🧹 Clearing all filters');
    this.store.dispatch(MonitorActions.resetFilters());
  }

  selectAllIds(): void {
    this.availableIds$.pipe(takeUntil(this.destroy$)).subscribe(ids => {
      console.log('🆔 Selecting all IDs:', ids);
      this.store.dispatch(MonitorActions.updateSelectedIDs({ selectedIds: [...ids] }));
    }).unsubscribe();
  }

  // Export functionality
  exportResults(): void {
    console.log('📤 Export functionality to be implemented');
    // TODO: Implement export
  }

  // Refresh data
  refreshData(): void {
    console.log('🔄 Refreshing trainee data...');
    this.store.dispatch(TraineeActions.loadTrainees());
  }

  // Debug method for template
  logDebugInfo(): void {
    console.log('🐛 Debug Info:', this.debugInfo);
    console.log('🏪 Store state check...');
    
    // Force check store state
    this.store.select(state => state).pipe(takeUntil(this.destroy$)).subscribe(state => {
      console.log('🏪 Full store state:', state);
    }).unsubscribe();
  }
}
