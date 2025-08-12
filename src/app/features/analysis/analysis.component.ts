import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AnalysisFiltersComponent } from './components/analysis-filters/analysis-filters.component';
import { ChartContainerComponent } from './components/chart-container/chart-container.component';

import { AnalysisActions } from '../../store/analysis/analysis.actions';
import { TraineeActions } from '../../store/trainee/trainee.actions';
import { 
  selectChartByPosition, 
  selectFilteredTraineesForCharts 
} from '../../store/analysis/analysis.selectors';
import { selectLoading } from '../../store/trainee/trainee.selectors';
import { ChartPosition } from '../../core/models/analysis.model';
import { Trainee } from '../../core/models/trainee.model';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    DragDropModule,
    AnalysisFiltersComponent,
    ChartContainerComponent
  ],
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {
  private store = inject(Store);

  filteredTrainees$: Observable<Trainee[]>;
  loading$: Observable<boolean>;
  
  leftChart$: Observable<ChartPosition | undefined>;
  rightChart$: Observable<ChartPosition | undefined>;
  hiddenChart$: Observable<ChartPosition | undefined>;

  constructor() {
    this.filteredTrainees$ = this.store.select(selectFilteredTraineesForCharts);
    this.loading$ = this.store.select(selectLoading);
    
    this.leftChart$ = this.store.select(selectChartByPosition(0));
    this.rightChart$ = this.store.select(selectChartByPosition(1));
    this.hiddenChart$ = this.store.select(selectChartByPosition(2));
  }

  ngOnInit(): void {
    // Load trainee data if not already loaded
    this.store.dispatch(TraineeActions.loadTrainees());
    
    // Initialize analysis data
    this.store.dispatch(AnalysisActions.loadAnalysisData());
  }

  onChartSwapped(event: {fromPosition: number, toPosition: number}): void {
    this.store.dispatch(AnalysisActions.swapCharts({
      fromPosition: event.fromPosition,
      toPosition: event.toPosition
    }));
  }
}
