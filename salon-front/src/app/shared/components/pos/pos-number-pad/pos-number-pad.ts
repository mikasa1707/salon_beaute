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

  press(key: string) {
    let text = (this.value ?? '').toString();

    switch (key) {
      case 'C':
        text = '';
        break;

      case '⌫':
        text = text.slice(0, -1);
        break;

      default:
        text += key;
        break;
    }

    this.value = text;

    this.valueChange.emit(text === '' ? 0 : Number(text));
  }

  clear() {
    this.valueChange.emit(0);
  }

  reset() {
    this.value = 0;
    this.valueChange.emit(0);
  }
}
