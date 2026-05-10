import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateRange',
  standalone: true,
})
export class DateRangePipe implements PipeTransform {
  transform(startDate: string, endDate: string | null, isCurrent = false): string {
    const start = new Date(startDate);
    const startYear = start.getFullYear();

    if (isCurrent || !endDate) {
      return `${startYear} — Present`;
    }

    const end = new Date(endDate);
    const endYear = end.getFullYear();
    return `${startYear} — ${endYear}`;
  }
}
