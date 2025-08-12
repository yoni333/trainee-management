import { Component, EventEmitter, Output, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/material.module';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { selectSelectedTrainee } from '../../../../store/trainee/trainee.selectors';
import { TraineeActions } from '../../../../store/trainee/trainee.actions';
import { FilterCriteria, FilterParserService } from '../../../../core/services/filter-parser-service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
@Component({
  selector: 'app-smart-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,MatCardModule,MatFormFieldModule, MatInputModule,
            MatIconModule, MatButtonModule, MatTooltipModule, MatExpansionModule, MatChipsModule
  ],
  templateUrl: './smart-filter.component.html',
  styleUrls: ['./smart-filter.component.scss']
})
export class SmartFilterComponent implements OnInit, OnDestroy {
  @Output() filterChange = new EventEmitter<FilterCriteria>();
  @Output() addTrainee = new EventEmitter<void>();

  private store = inject(Store);
  private filterParser = inject(FilterParserService);
  private destroy$ = new Subject<void>();

  filterControl = new FormControl('');
  selectedTrainee$: Observable<any>;
  showHelp = false;
  suggestions: string[] = [];

  constructor() {
    this.selectedTrainee$ = this.store.select(selectSelectedTrainee);
    this.suggestions = this.filterParser.getSuggestions();
  }

  ngOnInit(): void {
    // Listen to filter input changes with debouncing
    this.filterControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      const criteria = this.filterParser.parseQuery(value || '');
      this.filterChange.emit(criteria);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onAddClick(): void {
    this.addTrainee.emit();
  }

  onRemoveClick(): void {
    this.selectedTrainee$.pipe(takeUntil(this.destroy$)).subscribe(trainee => {
      if (trainee) {
        this.store.dispatch(TraineeActions.removeTrainee({ id: trainee.id }));
      }
    }).unsubscribe();
  }

  clearFilter(): void {
    this.filterControl.setValue('');
  }

  toggleHelp(): void {
    this.showHelp = !this.showHelp;
  }

  insertSuggestion(suggestion: string): void {
    const currentValue = this.filterControl.value || '';
    const newValue = currentValue ? `${currentValue} ${suggestion}` : suggestion;
    this.filterControl.setValue(newValue);
  }

  getExamples(): string[] {
    return [
      'john - Search all fields for "john"',
      'id:123 - Find specific ID',
      'grade:>85 - Grades greater than 85',
      'grade:<90 - Grades less than 90',
      'date:>2024-01-15 - Joined after date',
      'email:gmail - Emails containing "gmail"',
      'city:"New York" - City with spaces (use quotes)',
      'subject:Math grade:>80 - Multiple criteria'
    ];
  }
}