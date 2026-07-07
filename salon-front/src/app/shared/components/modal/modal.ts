import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './modal.html',
  styleUrl: './modal.scss'
})
export class ModalComponent {

  @Input() title = '';
  @Input() show = false;
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}