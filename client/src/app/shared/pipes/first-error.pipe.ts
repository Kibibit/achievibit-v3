import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstError',
  standalone: true
})
export class FirstErrorPipe implements PipeTransform {
  transform(errors: Record<string, any> | null): string | null {
    if (!errors) return null;

    const firstKey = Object.keys(errors)[0];
    const value = errors[firstKey];

    if (typeof value === 'string') return value;

    if (typeof value === 'object') {
      const firstNested = Object.values(value)[0];
      return typeof firstNested === 'string' ? firstNested : null;
    }

    return null;
  }
}
