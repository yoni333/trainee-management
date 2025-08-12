import { Component, Input, Output, EventEmitter, ViewChild, OnChanges, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/modules/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Trainee } from '../../../../core/models/trainee.model';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
@Component({
  selector: 'app-trainee-table',
  standalone: true,
  imports: [CommonModule, MatTableModule,MatPaginatorModule,MatSortModule,MatProgressSpinnerModule,
            MatIconModule, MatChipsModule
  ],
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

  displayedColumns: string[] = ['id', 'name', 'grade', 'dateJoined',  'subject'];
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