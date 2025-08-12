import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/material.module';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectSelectedTrainee } from '../../../../store/trainee/trainee.selectors';
import { TraineeActions } from '../../../../store/trainee/trainee.actions';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
@Component({
  selector: 'app-trainee-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule,
    MatIconModule, MatButtonModule,MatTooltipModule, MatExpansionModule,MatChipsModule,MatOptionModule
   ],
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
