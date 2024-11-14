import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reservationFlag',
  standalone: true,
})
export class ReservationFlagPipe implements PipeTransform {
  transform(value: number): string {
    let reverse = '';
    switch (value) {
      case 0:
        reverse = 'Utworzona';
        break;
      case 1:
        reverse = 'Potwierdzona';
        break;
      case 2:
        reverse = 'Anulowana';
        break;
      case 3:
        reverse = 'Zakończona';
        break;
      default:
        reverse = 'Nieznana';
        break;
    }
    return reverse;
  }
}
