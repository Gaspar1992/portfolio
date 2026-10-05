import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'uppercase',
  standalone: true,
})
export class UpperCasePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return value ? value.toUpperCase() : '';
  }
}
