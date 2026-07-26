import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pos-number-pad',
  standalone: true,
  templateUrl: './pos-number-pad.html',
  styleUrl: './pos-number-pad.scss',
})
export class PosNumberPadComponent {
  @Input() value: string | number = '';
  @Output() valueChange = new EventEmitter<number>();

  keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', 'C', '0', '⌫'];

  press(k: string) {
    this.value += k;

    this.valueChange.emit(Number(this.value));

    let text = this.value?.toString() ?? '';

    switch (k) {
      case '⌫':
        text = text.slice(0, -1);
        break;

      case 'C':
        text = '';
        break;

      default:
        text += k;
        break;
    }
    this.valueChange.emit(0);
  }
  
  clear() {
    this.valueChange.emit(0);
  }

  reset() {
    this.value = 0;
    this.valueChange.emit(0);
  }
}
