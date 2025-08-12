import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trainee } from '../../../../core/models/trainee.model';

@Component({
  selector: 'app-subject-averages-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <canvas #chartCanvas width="400" height="300"></canvas>
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
    }
    
    canvas {
      max-width: 100%;
      max-height: 100%;
    }
    
    .no-data {
      text-align: center;
      color: #666;
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
export class SubjectAveragesChartComponent implements OnChanges {
  @Input() trainees: Trainee[] = [];
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  hasData = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trainees']) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    this.hasData = this.trainees.length > 0;
    
    if (this.hasData) {
      this.drawChart();
    }
  }

  private drawChart(): void {
    const canvas = this.chartCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Simple chart drawing (placeholder for now)
    ctx.fillStyle = '#fff3e0';
    ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);
    
    ctx.fillStyle = '#666';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Subject Averages Chart', canvas.width / 2, 30);
    ctx.fillText(`${this.trainees.length} trainees`, canvas.width / 2, canvas.height / 2);
  }
}
