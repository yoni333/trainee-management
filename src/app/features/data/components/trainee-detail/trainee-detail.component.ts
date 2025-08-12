import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Store } from '@ngrx/store';
import { Trainee } from '../../../../core/models/trainee.model';
import { TraineeActions } from '../../../../store/trainee/trainee.actions';

@Component({
  selector: 'app-trainee-detail',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatChipsModule,
    MatProgressBarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './trainee-detail.component.html',
  styleUrls: ['./trainee-detail.component.scss']
})
export class TraineeDetailComponent implements OnChanges {
  @Input() trainee: Trainee | null = null;

  private fb = inject(FormBuilder);
  private store = inject(Store);

  isEditing = false;
  traineeForm: FormGroup;
  subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'];

  constructor() {
    this.traineeForm = this.fb.group({
      id: [{value: '', disabled: true}],
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      grade: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      dateJoined: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', Validators.required],
      subject: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trainee'] && this.trainee) {
      this.loadTraineeData();
      this.isEditing = false;
    }
  }

  private loadTraineeData(): void {
    if (this.trainee) {
      this.traineeForm.patchValue({
        id: this.trainee.id,
        name: this.trainee.name,
        email: this.trainee.email,
        grade: this.trainee.grade,
        dateJoined: this.trainee.dateJoined,
        address: this.trainee.address,
        city: this.trainee.city,
        country: this.trainee.country,
        zip: this.trainee.zip,
        subject: this.trainee.subject
      });
    }
  }

  startEdit(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.loadTraineeData(); // Reset form to original data
  }

  saveChanges(): void {
    if (this.traineeForm.valid && this.trainee) {
      const updatedTrainee: Trainee = {
        ...this.trainee,
        ...this.traineeForm.value,
        id: this.trainee.id // Keep original ID
      };

      // Dispatch update action
      this.store.dispatch(TraineeActions.updateTrainee({ 
        id: this.trainee.id, 
        trainee: updatedTrainee 
      }));

      this.isEditing = false;
    }
  }

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

  hasError(fieldName: string): boolean {
    const field = this.traineeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.traineeForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['min']) return `Minimum value is ${field.errors['min'].min}`;
      if (field.errors['max']) return `Maximum value is ${field.errors['max'].max}`;
      if (field.errors['minlength']) return `Minimum length is ${field.errors['minlength'].requiredLength}`;
    }
    return '';
  }
}