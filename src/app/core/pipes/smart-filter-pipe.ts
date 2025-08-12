import { Pipe, PipeTransform } from '@angular/core';
import { Trainee } from '../models/trainee.model';
import { FilterCriteria } from '../services/filter-parser-service';

@Pipe({
  name: 'smartFilter',
  standalone:true,
  pure: true
})
export class SmartFilterPipe implements PipeTransform {

  transform(trainees: Trainee[], criteria: FilterCriteria): Trainee[] {
    if (!trainees || !criteria || Object.keys(criteria).length === 0) {
      return trainees;
    }

    return trainees.filter(trainee => this.matchesCriteria(trainee, criteria));
  }

  private matchesCriteria(trainee: Trainee, criteria: FilterCriteria): boolean {
    // General search across all text fields
    if (criteria.generalSearch) {
      const searchTerm = criteria.generalSearch.toLowerCase();
      const searchableText = [
        trainee.id,
        trainee.name,
        trainee.email,
        trainee.city,
        trainee.country,
        trainee.zip,
        trainee.subject,
        trainee.grade.toString()
      ].join(' ').toLowerCase();

      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }

    // Specific field searches
    if (criteria.id && !trainee.id.toLowerCase().includes(criteria.id.toLowerCase())) {
      return false;
    }

    if (criteria.name && !trainee.name.toLowerCase().includes(criteria.name.toLowerCase())) {
      return false;
    }

    if (criteria.email && !trainee.email.toLowerCase().includes(criteria.email.toLowerCase())) {
      return false;
    }

    if (criteria.city && !trainee.city.toLowerCase().includes(criteria.city.toLowerCase())) {
      return false;
    }

    if (criteria.country && !trainee.country.toLowerCase().includes(criteria.country.toLowerCase())) {
      return false;
    }

    if (criteria.zip && !trainee.zip.toLowerCase().includes(criteria.zip.toLowerCase())) {
      return false;
    }

    if (criteria.subject && !trainee.subject.toLowerCase().includes(criteria.subject.toLowerCase())) {
      return false;
    }

    // Grade filtering with operators
    if (criteria.grade) {
      if (!this.compareNumbers(trainee.grade, criteria.grade.operator, criteria.grade.value)) {
        return false;
      }
    }

    // Date filtering with operators
    if (criteria.date) {
      const traineeDate = new Date(trainee.dateJoined);
      if (!this.compareDates(traineeDate, criteria.date.operator, criteria.date.value)) {
        return false;
      }
    }

    return true;
  }

  private compareNumbers(value: number, operator: string, target: number): boolean {
    switch (operator) {
      case '>': return value > target;
      case '<': return value < target;
      case '>=': return value >= target;
      case '<=': return value <= target;
      case '=': return value === target;
      default: return true;
    }
  }

  private compareDates(value: Date, operator: string, target: Date): boolean {
    const valueTime = value.getTime();
    const targetTime = target.getTime();

    switch (operator) {
      case '>': return valueTime > targetTime;
      case '<': return valueTime < targetTime;
      case '>=': return valueTime >= targetTime;
      case '<=': return valueTime <= targetTime;
      case '=': return this.isSameDay(value, target);
      default: return true;
    }
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
}