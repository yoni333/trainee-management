import { Component, Input, OnChanges, SimpleChanges, OnDestroy, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType, registerables, ChartData, ChartDataset } from 'chart.js';
import { Trainee } from '../../../../core/models/trainee.model';

Chart.register(...registerables);

@Component({
  selector: 'app-subject-averages-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <canvas #chartCanvas></canvas>
      <div *ngIf="!hasData" class="no-data">
        <p>No data available for selected subjects</p>
        <small>Select subjects to display chart</small>
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
export class SubjectAveragesChartComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() trainees: Trainee[] = [];
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  private chart: Chart<'doughnut', number[]> | null = null;
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

    const config: ChartConfiguration<'doughnut', number[]> = {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [{
          label: 'Average Grade by Subject',
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
            text: 'Average Grades by Subject',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            display: true,
            position: 'right'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                return `${label}: ${value.toFixed(1)} avg grade`;
              }
            }
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

    // Calculate averages per subject
    const subjectAverages = this.calculateSubjectAverages();
    
    // Sort by average grade (highest first)
    const sortedData = Object.entries(subjectAverages)
      .sort(([,a], [,b]) => b.average - a.average);

    const labels = sortedData.map(([subject]) => subject);
    const averages = sortedData.map(([,data]) => data.average);
    const colors = this.generateSubjectColors(labels);

    this.chart.data.labels = labels;
    if (this.chart.data.datasets[0]) {
      this.chart.data.datasets[0].data = averages;
      this.chart.data.datasets[0].backgroundColor = colors.map(c => c + '80');
      this.chart.data.datasets[0].borderColor = colors;
    }
    this.chart.update();
  }

  private calculateSubjectAverages(): { [subject: string]: { average: number, count: number } } {
    const subjectData: { [subject: string]: { total: number, count: number } } = {};

    this.trainees.forEach(trainee => {
      if (!subjectData[trainee.subject]) {
        subjectData[trainee.subject] = {
          total: 0,
          count: 0
        };
      }
      
      subjectData[trainee.subject].total += trainee.grade;
      subjectData[trainee.subject].count += 1;
    });

    // Calculate averages
    const result: { [subject: string]: { average: number, count: number } } = {};
    Object.entries(subjectData).forEach(([subject, data]) => {
      result[subject] = {
        average: Math.round((data.total / data.count) * 100) / 100,
        count: data.count
      };
    });

    return result;
  }

  private generateSubjectColors(subjects: string[]): string[] {
    const subjectColors: { [key: string]: string } = {
      'Mathematics': '#3F51B5',    // Indigo
      'Physics': '#2196F3',        // Blue  
      'Chemistry': '#4CAF50',      // Green
      'Biology': '#FF9800',        // Orange
      'Computer Science': '#9C27B0', // Purple
      'English': '#F44336',        // Red
      'History': '#795548',        // Brown
      'Geography': '#607D8B'       // Blue Grey
    };

    const defaultColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
      '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
    ];

    return subjects.map((subject, index) => {
      return subjectColors[subject] || defaultColors[index % defaultColors.length];
    });
  }
}
