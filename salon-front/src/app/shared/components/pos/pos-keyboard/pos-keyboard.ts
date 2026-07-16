import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-pos-keyboard',
  standalone: true,
  templateUrl: './pos-keyboard.html',
  styleUrl: './pos-keyboard.scss',
})
export class PosKeyboardComponent {
  @Output()
  valueChange = new EventEmitter<string>();

  value = '';

  keys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  press(key: string) {
    this.value += key;

    this.valueChange.emit(this.value);
  }

  clear() {
    this.value = '';
    this.valueChange.emit('');
  }

  back() {
    this.value = this.value.slice(0, -1);
    this.valueChange.emit(this.value);
  }
}
