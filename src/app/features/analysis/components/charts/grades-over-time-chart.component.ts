import { Component, Input, OnChanges, SimpleChanges, OnDestroy, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType, registerables, ChartData, ChartDataset } from 'chart.js';
import { Trainee } from '../../../../core/models/trainee.model';

// Register Chart.js components
Chart.register(...registerables);

interface TimeSeriesDataPoint {
  x: string;
  y: number;
}

@Component({
  selector: 'app-grades-over-time-chart',
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
export class GradesOverTimeChartComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() trainees: Trainee[] = [];
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  private chart: Chart<'line', TimeSeriesDataPoint[]> | null = null;
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

    const config: ChartConfiguration<'line', TimeSeriesDataPoint[]> = {
      type: 'line',
      data: {
        datasets: []
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Grades Over Time by Student',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          x: {
            type: 'category',
            title: {
              display: true,
              text: 'Date Joined'
            }
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: 'Grade'
            },
            min: 0,
            max: 100
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
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
      this.chart.data.datasets = [];
      this.chart.update();
      return;
    }

    // Process data: Group by student ID and sort by date
    const studentData = this.processTimeSeriesData();
    
    // Generate colors for each student
    const colors = this.generateColors(Object.keys(studentData).length);
    
    // Create datasets for each student
    const datasets: ChartDataset<'line', TimeSeriesDataPoint[]>[] = Object.entries(studentData).map(([studentId, data], index) => {
      const student = this.trainees.find(t => t.id === studentId);
      return {
        label: `${student?.name || studentId}`,
        data: data.map(d => ({ x: d.date, y: d.grade })) as TimeSeriesDataPoint[],
        borderColor: colors[index],
        backgroundColor: colors[index] + '20',
        tension: 0.4,
        fill: false
      };
    });

    this.chart.data.datasets = datasets;
    this.chart.update();
  }

  private processTimeSeriesData(): { [studentId: string]: { date: string, grade: number }[] } {
    const studentData: { [studentId: string]: { date: string, grade: number }[] } = {};

    this.trainees.forEach(trainee => {
      if (!studentData[trainee.id]) {
        studentData[trainee.id] = [];
      }
      
      studentData[trainee.id].push({
        date: trainee.dateJoined.toISOString().split('T')[0],
        grade: trainee.grade
      });
    });

    // Sort each student's data by date
    Object.keys(studentData).forEach(studentId => {
      studentData[studentId].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });

    return studentData;
  }

  private generateColors(count: number): string[] {
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
      '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
    ];
    
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(colors[i % colors.length]);
    }
    return result;
  }
}
