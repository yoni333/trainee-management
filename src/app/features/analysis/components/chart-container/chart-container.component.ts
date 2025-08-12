import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ChartPosition } from '../../../../core/models/analysis.model';
import { Trainee } from '../../../../core/models/trainee.model';
import { GradesOverTimeChartComponent } from '../charts/grades-over-time-chart.component';
import { StudentAveragesChartComponent } from '../charts/student-averages-chart.component';
import { SubjectAveragesChartComponent } from '../charts/subject-averages-chart.component';

@Component({
  selector: 'app-chart-container',
  standalone: true,
  imports: [
    CommonModule, 
    DragDropModule, 
    MatCardModule, 
    MatIconModule, 
    MatButtonModule,
    GradesOverTimeChartComponent,
    StudentAveragesChartComponent,
    SubjectAveragesChartComponent
  ],
  template: `
    <div class="chart-container" 
         cdkDropList 
         [cdkDropListData]="position"
         (cdkDropListDropped)="onDrop($event)"
         [class.hidden-chart]="position === 2">
      
      <mat-card 
        cdkDrag
        [cdkDragData]="chartPosition"
        class="chart-card"
        [class.hidden-chart-button]="position === 2">
        
        <mat-card-header *ngIf="position !== 2" cdkDragHandle>
          <mat-card-title>
            <mat-icon class="drag-handle">drag_indicator</mat-icon>
            {{ getChartTitle() }}
          </mat-card-title>
          <div class="spacer"></div>
          <mat-icon class="chart-icon">{{ getChartIcon() }}</mat-icon>
        </mat-card-header>

        <!-- Hidden Chart Button (Position 2) -->
        <div *ngIf="position === 2" class="hidden-chart-content" cdkDragHandle>
          <mat-icon>drag_indicator</mat-icon>
          <span>{{ getChartTitle() }}</span>
        </div>

        <!-- Chart Content (Positions 0 & 1) -->
        <mat-card-content *ngIf="position !== 2" class="chart-content">
          <div class="chart-wrapper">
            
            <!-- Chart 1: Grades Over Time -->
            <app-grades-over-time-chart 
              *ngIf="chartPosition?.chartType === 'gradesOverTime'"
              [trainees]="trainees">
            </app-grades-over-time-chart>
            
            <!-- Chart 2: Student Averages -->
            <app-student-averages-chart 
              *ngIf="chartPosition?.chartType === 'studentAverages'"
              [trainees]="trainees">
            </app-student-averages-chart>
            
            <!-- Chart 3: Subject Averages -->
            <app-subject-averages-chart 
              *ngIf="chartPosition?.chartType === 'subjectAverages'"
              [trainees]="trainees">
            </app-subject-averages-chart>
            
          </div>
        </mat-card-content>
        
      </mat-card>
    </div>
  `,
  styles: [`
    .chart-container {
      height: 100%;
      min-height: 300px;
    }

    .chart-container.hidden-chart {
      height: auto;
      min-height: 60px;
    }

    .chart-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      cursor: move;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .chart-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .chart-card.hidden-chart-button {
      height: auto;
      background-color: #f5f5f5;
      border: 2px dashed #ccc;
      cursor: grab;
    }

    .chart-card.hidden-chart-button:hover {
      background-color: #e8f5e8;
      border-color: #4caf50;
    }

    .chart-card mat-card-header {
      background-color: #fafafa;
      padding: 12px 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .chart-card mat-card-header mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 500;
    }

    .drag-handle {
      color: #666;
      font-size: 20px;
      cursor: grab;
    }

    .drag-handle:active {
      cursor: grabbing;
    }

    .spacer {
      flex: 1;
    }

    .chart-icon {
      color: #666;
      font-size: 20px;
    }

    .chart-content {
      flex: 1;
      padding: 16px;
      display: flex;
      flex-direction: column;
    }

    .chart-wrapper {
      flex: 1;
      min-height: 250px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hidden-chart-content {
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: center;
      color: #666;
      font-weight: 500;
    }

    .hidden-chart-content mat-icon {
      color: #999;
    }

    /* CDK Drag & Drop Styles */
    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .cdk-drop-list-dragging .cdk-drag:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .cdk-drag-placeholder {
      opacity: 0.4;
      border: 2px dashed #ccc;
    }

    .cdk-drag-preview {
      box-sizing: border-box;
      border-radius: 4px;
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
                  0 8px 10px 1px rgba(0, 0, 0, 0.14),
                  0 3px 14px 2px rgba(0, 0, 0, 0.12);
    }
  `]
})
export class ChartContainerComponent {
  @Input() position!: number; // 0 = left, 1 = right, 2 = hidden
  @Input() chartPosition!: ChartPosition | undefined;
  @Input() trainees: Trainee[] = [];
  @Output() chartSwapped = new EventEmitter<{fromPosition: number, toPosition: number}>();

  onDrop(event: CdkDragDrop<number>): void {
    if (event.previousContainer !== event.container) {
      const fromPosition = event.previousContainer.data;
      const toPosition = event.container.data;
      this.chartSwapped.emit({ fromPosition, toPosition });
    }
  }

  getChartTitle(): string {
    if (!this.chartPosition) return '';
    
    switch (this.chartPosition.chartType) {
      case 'gradesOverTime':
        return 'Chart 1: Grades average over time for students with ID (for each student)';
      case 'studentAverages':
        return 'Chart 2: Students averages for students with chosen ID';
      case 'subjectAverages':
        return 'Chart 3: Grades averages per subject';
      default:
        return '';
    }
  }

  getChartIcon(): string {
    if (!this.chartPosition) return 'bar_chart';
    
    switch (this.chartPosition.chartType) {
      case 'gradesOverTime':
        return 'timeline';
      case 'studentAverages':
        return 'person';
      case 'subjectAverages':
        return 'school';
      default:
        return 'bar_chart';
    }
  }
}
