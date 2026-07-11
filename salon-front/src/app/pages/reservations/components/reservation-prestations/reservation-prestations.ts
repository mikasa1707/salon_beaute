import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-reservation-prestations',
  imports: [],
  templateUrl: './reservation-prestations.html',
  styleUrl: './reservation-prestations.scss',
})
export class ReservationPrestations {

  @Input()  selected: any[] = [];

  @Output()  selectedChange = new EventEmitter<any[]>();

  add(prestation: any) {
    this.selected = [
      ...this.selected,
      prestation
    ];
    this.selectedChange.emit(this.selected);
  }

  remove(id: number) {
    this.selected =
      this.selected.filter(
        x => x.id !== id
      );
    this.selectedChange.emit(this.selected);
  }
}
