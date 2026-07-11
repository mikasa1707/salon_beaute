import {
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'app-reservation-summary',
  standalone: true,
  templateUrl: './reservation-summary.html'
})
export class ReservationSummary {

  @Input()
  prestations: any[] = [];


  get total() {
    return this.prestations
      .reduce(
        (a, b) => a + Number(b.prix),
        0
      );
  }


  get duree() {
    return this.prestations
      .reduce(
        (a, b) => a + Number(b.duree),
        0
      );
  }

}