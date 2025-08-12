import { Injectable } from '@angular/core';

export interface FilterCriteria {
  generalSearch?: string;
  id?: string;
  name?: string;
  email?: string;
  city?: string;
  country?: string;
  zip?: string;
  subject?: string;
  grade?: {
    operator: '>' | '<' | '=' | '>=' | '<=';
    value: number;
  };
  date?: {
    operator: '>' | '<' | '=' | '>=' | '<=';
    value: Date;
  };
}

@Injectable({
  providedIn: 'root'
})
export class FilterParserService {

  parseQuery(input: string): FilterCriteria {
    if (!input?.trim()) {
      return {};
    }

    const criteria: FilterCriteria = {};
    const tokens = this.tokenize(input.trim());
    
    for (const token of tokens) {
      const parsed = this.parseToken(token);
      if (parsed) {
        Object.assign(criteria, parsed);
      }
    }

    return criteria;
  }

  private tokenize(input: string): string[] {
    // Split by spaces but preserve quoted strings
    const regex = /(?:[^\s"]+|"[^"]*")+/g;
    return input.match(regex) || [];
  }

  private parseToken(token: string): Partial<FilterCriteria> | null {
    // Remove quotes if present
    token = token.replace(/^"|"$/g, '');

    // Check for field:value pattern
    const fieldMatch = token.match(/^(\w+):(.+)$/);
    if (!fieldMatch) {
      // No field specified, treat as general search
      return { generalSearch: token };
    }

    const [, field, value] = fieldMatch;
    const fieldLower = field.toLowerCase();

    switch (fieldLower) {
      case 'id':
        return { id: value };
      
      case 'name':
        return { name: value };
      
      case 'email':
        return { email: value };
      
      case 'city':
        return { city: value };
      
      case 'country':
        return { country: value };
      
      case 'zip':
        return { zip: value };
      
      case 'subject':
        return { subject: value };
      
      case 'grade':
        return { grade: this.parseNumericFilter(value) };
      
      case 'date':
        return { date: this.parseDateFilter(value) };
      
      default:
        // Unknown field, treat as general search
        return { generalSearch: token };
    }
  }

  private parseNumericFilter(value: string): { operator: '>' | '<' | '=' | '>=' | '<='; value: number } | undefined {
    const match = value.match(/^(>=|<=|>|<|=)?(.+)$/);
    if (!match) return undefined;

    const [, operator = '=', numStr] = match;
    const num = parseFloat(numStr);
    
    if (isNaN(num)) return undefined;

    return {
      operator: operator as '>' | '<' | '=' | '>=' | '<=',
      value: num
    };
  }

  private parseDateFilter(value: string): { operator: '>' | '<' | '=' | '>=' | '<='; value: Date } | undefined {
    const match = value.match(/^(>=|<=|>|<|=)?(.+)$/);
    if (!match) return undefined;

    const [, operator = '=', dateStr] = match;
    const date = new Date(dateStr);
    
    if (isNaN(date.getTime())) return undefined;

    return {
      operator: operator as '>' | '<' | '=' | '>=' | '<=',
      value: date
    };
  }

  getSuggestions(): string[] {
    return [
      'id:',
      'name:',
      'email:',
      'city:',
      'country:',
      'zip:',
      'subject:',
      'grade:>',
      'grade:<',
      'grade:=',
      'date:>',
      'date:<',
      'date:='
    ];
  }
}