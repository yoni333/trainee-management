import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { Trainee } from '../models/trainee.model';

@Injectable({
  providedIn: 'root'
})
export class TraineeService {
  private mockTrainees: Trainee[] = [
    { 
      id: '1', 
      name: 'John Doe', 
      grade: 85, 
      email: 'john.doe@email.com',
      dateJoined: new Date('2024-01-15'),
      address: '123 Main St',
      city: 'New York',
      country: 'USA',
      zip: '10001',
      subject: 'Mathematics' 
    },
    { 
      id: '2', 
      name: 'Jane Smith', 
      grade: 92, 
      email: 'jane.smith@email.com',
      dateJoined: new Date('2024-01-16'),
      address: '456 Oak Ave',
      city: 'Los Angeles',
      country: 'USA',
      zip: '90210',
      subject: 'Physics' 
    },
    { 
      id: '3', 
      name: 'Mike Johnson', 
      grade: 78, 
      email: 'mike.johnson@email.com',
      dateJoined: new Date('2024-01-17'),
      address: '789 Pine Rd',
      city: 'Chicago',
      country: 'USA',
      zip: '60601',
      subject: 'Chemistry' 
    },
    { 
      id: '4', 
      name: 'Sarah Wilson', 
      grade: 95, 
      email: 'sarah.wilson@email.com',
      dateJoined: new Date('2024-01-18'),
      address: '321 Elm St',
      city: 'Houston',
      country: 'USA',
      zip: '77001',
      subject: 'Mathematics' 
    },
    { 
      id: '5', 
      name: 'Tom Brown', 
      grade: 88, 
      email: 'tom.brown@email.com',
      dateJoined: new Date('2024-01-19'),
      address: '654 Maple Dr',
      city: 'Phoenix',
      country: 'USA',
      zip: '85001',
      subject: 'Physics' 
    },
    { 
      id: '6', 
      name: 'Lisa Davis', 
      grade: 91, 
      email: 'lisa.davis@email.com',
      dateJoined: new Date('2024-01-20'),
      address: '987 Cedar Ln',
      city: 'Philadelphia',
      country: 'USA',
      zip: '19101',
      subject: 'Chemistry' 
    },
    { 
      id: '7', 
      name: 'Chris Miller', 
      grade: 76, 
      email: 'chris.miller@email.com',
      dateJoined: new Date('2024-01-21'),
      address: '147 Birch Ave',
      city: 'San Antonio',
      country: 'USA',
      zip: '78201',
      subject: 'Mathematics' 
    },
    { 
      id: '8', 
      name: 'Emma Taylor', 
      grade: 89, 
      email: 'emma.taylor@email.com',
      dateJoined: new Date('2024-01-22'),
      address: '258 Spruce St',
      city: 'San Diego',
      country: 'USA',
      zip: '92101',
      subject: 'Physics' 
    }
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

  updateTrainee(id: string, trainee: Trainee): Observable<Trainee> {
    const index = this.mockTrainees.findIndex(t => t.id === id);
    if (index > -1) {
      this.mockTrainees[index] = trainee;
      return of(trainee).pipe(delay(300));
    }
    return throwError(() => new Error('Trainee not found'));
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