import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export type KeyboardMode = 'numeric' | 'phone' | 'text';

@Component({
  selector: 'app-numeric-keyboard',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './numeric-keyboard.html',
  styleUrl: './numeric-keyboard.scss',
})
export class NumericKeyboard {
  @Input() mode: KeyboardMode = 'numeric';

  @Input() value: string | number = '';

  @Input() quickValues: number[] = [];

  @Input() showExact = false;
  @Input() showQuickValues = true;

  @Input() exactValue = 0;

  @Output() valueChange = new EventEmitter<string | number>();

  @Output() exact = new EventEmitter<void>();

  numericKeys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '00', '0', '⌫'];

  textKeys = [
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['W', 'X', 'C', 'V', 'B', 'N', 'M'],
    ['⌫', 'ESPACE'],
  ];

  phoneKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', '⌫'];

  press(key: string) {
    let text = this.value?.toString() ?? '';

    if (key === '⌫') {
      text = text.slice(0, -1);
    } else {
      text += key;
    }

    if (this.mode === 'phone') {
      this.valueChange.emit(text);
    } else {
      this.valueChange.emit(Number(text || 0));
    }
  }

  pressText(key: string) {
    let text = this.value?.toString() ?? '';

    if (key === '⌫') {
      text = text.slice(0, -1);
    } else if (key === 'ESPACE') {
      text += ' ';
    } else {
      text += key;
    }

    this.valueChange.emit(text);
  }

  add(value: number) {
    const current = Number(this.value || 0);

    this.valueChange.emit(current + value);
  }

  clear() {
    this.valueChange.emit(this.mode === 'numeric' ? 0 : '');
  }

  useExact() {
    this.valueChange.emit(this.exactValue);

    this.exact.emit();
  }

  reset() {
    this.value = 0;
    this.valueChange.emit(0);
  }
}
