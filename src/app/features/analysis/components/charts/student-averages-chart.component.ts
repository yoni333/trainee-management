import { Component, Input, OnChanges, SimpleChanges, OnDestroy, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType, registerables, ChartData, ChartDataset } from 'chart.js';
import { Trainee } from '../../../../core/models/trainee.model';

Chart.register(...registerables);

@Component({
  selector: 'app-student-averages-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <canvas #chartCanvas></canvas>
      <div *ngIf="!hasData" class="no-data">
        <p>No data available for selected trainees</p>
        <small>Select trainee IDs to display chart</small>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      min-height: 300px;
    }
    
    canvas {
      max-width: 100%;
      max-height: 100%;
    }
    
    .no-data {
      text-align: center;
      color: #666;
      position: absolute;
    }
    
    .no-data p {
      margin: 0 0 8px 0;
      font-size: 16px;
    }
    
    .no-data small {
      font-size: 12px;
      color: #999;
    }
  `]
})
export class StudentAveragesChartComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() trainees: Trainee[] = [];
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  private chart: Chart<'bar', number[]> | null = null;
  private cdr = inject(ChangeDetectorRef);
  
  // Use getter to avoid change detection issues
  get hasData(): boolean {
    return this.trainees && this.trainees.length > 0;
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trainees'] && this.chart) {
      // Defer chart update to avoid change detection issues
      setTimeout(() => {
        this.updateChart();
      }, 0);
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private createChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'bar', number[]> = {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Average Grade',
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Student Average Grades',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Students'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Average Grade'
            },
            min: 0,
            max: 100
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
    
    // Initial chart update
    setTimeout(() => {
      this.updateChart();
    }, 0);
  }

  private updateChart(): void {
    if (!this.chart) return;

    if (!this.hasData) {
      this.chart.data.labels = [];
      if (this.chart.data.datasets[0]) {
        this.chart.data.datasets[0].data = [];
        this.chart.data.datasets[0].backgroundColor = [];
        this.chart.data.datasets[0].borderColor = [];
      }
      this.chart.update();
      return;
    }

    // Calculate averages per student
    const studentAverages = this.calculateStudentAverages();
    
    // Sort by grade (highest first)
    const sortedData = Object.entries(studentAverages)
      .sort(([,a], [,b]) => b.average - a.average);

    const labels = sortedData.map(([studentId, data]) => data.name);
    const grades = sortedData.map(([,data]) => data.average);
    const colors = grades.map(grade => this.getGradeColor(grade));

    this.chart.data.labels = labels;
    if (this.chart.data.datasets[0]) {
      this.chart.data.datasets[0].data = grades;
      this.chart.data.datasets[0].backgroundColor = colors.map(c => c + '80');
      this.chart.data.datasets[0].borderColor = colors;
    }
    this.chart.update();
  }

  private calculateStudentAverages(): { [studentId: string]: { name: string, average: number, count: number } } {
    const studentData: { [studentId: string]: { name: string, total: number, count: number } } = {};

    this.trainees.forEach(trainee => {
      if (!studentData[trainee.id]) {
        studentData[trainee.id] = {
          name: trainee.name,
          total: 0,
          count: 0
        };
      }
      
      studentData[trainee.id].total += trainee.grade;
      studentData[trainee.id].count += 1;
    });

    // Calculate averages
    const result: { [studentId: string]: { name: string, average: number, count: number } } = {};
    Object.entries(studentData).forEach(([studentId, data]) => {
      result[studentId] = {
        name: data.name,
        average: Math.round((data.total / data.count) * 100) / 100,
        count: data.count
      };
    });

    return result;
  }

  private getGradeColor(grade: number): string {
    if (grade >= 90) return '#4CAF50'; // Green
    if (grade >= 80) return '#8BC34A'; // Light Green  
    if (grade >= 70) return '#FFC107'; // Amber
    if (grade >= 60) return '#FF9800'; // Orange
    return '#F44336'; // Red
  }
}
