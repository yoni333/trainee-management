import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  
  getGradeColorPalette(): { [key: string]: string } {
    return {
      excellent: '#4CAF50',  // Green (90+)
      good: '#8BC34A',       // Light Green (80-89)
      average: '#FFC107',    // Amber (70-79)
      below: '#FF9800',      // Orange (60-69)
      poor: '#F44336'        // Red (<60)
    };
  }

  getSubjectColorPalette(): { [key: string]: string } {
    return {
      'Mathematics': '#3F51B5',
      'Physics': '#2196F3',
      'Chemistry': '#4CAF50',
      'Biology': '#FF9800',
      'Computer Science': '#9C27B0',
      'English': '#F44336',
      'History': '#795548',
      'Geography': '#607D8B'
    };
  }

  generateColors(count: number, palette: string[] = []): string[] {
    const defaultPalette = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
      '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
    ];
    
    const colors = palette.length > 0 ? palette : defaultPalette;
    const result = [];
    
    for (let i = 0; i < count; i++) {
      result.push(colors[i % colors.length]);
    }
    
    return result;
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((a, b) => a + b, 0);
    return Math.round((sum / numbers.length) * 100) / 100;
  }
}
