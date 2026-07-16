import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-pos-number-pad',
  standalone: true,
  templateUrl: './pos-number-pad.html',
  styleUrl: './pos-number-pad.scss',
})
export class PosNumberPadComponent {
  @Output()
  valueChange = new EventEmitter<number>();

  value = '';

  keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'];

  press(k: string) {
    this.value += k;

    this.valueChange.emit(Number(this.value));
  }

  clear() {
    this.value = '';

    this.valueChange.emit(0);
  }
}
