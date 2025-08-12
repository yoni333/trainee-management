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
