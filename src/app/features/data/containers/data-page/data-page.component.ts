import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MaterialModule } from '../../../../shared/modules/material.module';
import { TraineeTableComponent } from '../../components/trainee-table/trainee-table.component';
import { TraineeDetailComponent } from '../../components/trainee-detail/trainee-detail.component';
import { Trainee } from '../../../../core/models/trainee.model';
import { TraineeActions } from '../../../../store/trainee/trainee.actions';
import { selectAllTrainees, selectSelectedTrainee, selectLoading } from '../../../../store/trainee/trainee.selectors';
import { SmartFilterComponent } from '../../components/smart-filter/smart-filter-component';
import { SmartFilterPipe } from '../../../../core/pipes/smart-filter-pipe';
import { FilterCriteria } from '../../../../core/services/filter-parser-service';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-data-page',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule,
    TraineeTableComponent,
    TraineeDetailComponent,
    SmartFilterComponent,
    SmartFilterPipe,
    AsyncPipe
  ],
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.scss']
})
export class DataPageComponent implements OnInit {
  private store = inject(Store);

  allTrainees$: Observable<Trainee[]>;
  selectedTrainee$: Observable<Trainee | null>;
  loading$: Observable<boolean>;
  currentFilter: FilterCriteria = {};

  constructor() {
    this.allTrainees$ = this.store.select(selectAllTrainees);
    this.selectedTrainee$ = this.store.select(selectSelectedTrainee);
    this.loading$ = this.store.select(selectLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(TraineeActions.loadTrainees());
  }

  onFilterChange(criteria: FilterCriteria): void {
    this.currentFilter = criteria;
  }

  onTraineeSelected(trainee: Trainee): void {
    this.store.dispatch(TraineeActions.selectTrainee({ trainee }));
  }

  onAddTrainee(): void {
    const newTrainee = {
      name: 'New Trainee',
      grade: 0,
      email: 'new.trainee@email.com',
      dateJoined: new Date(),
      address: '123 New Street',
      city: 'New City',
      country: 'USA',
      zip: '12345',
      subject: 'Mathematics'
    };
    this.store.dispatch(TraineeActions.addTrainee({ trainee: newTrainee }));
  }
}