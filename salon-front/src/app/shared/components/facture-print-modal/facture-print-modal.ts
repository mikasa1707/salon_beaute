import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Facturation } from '../../../core/models/facturation';
import { ModalComponent } from '../modal/modal';

@Component({
  selector: 'app-facture-print-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './facture-print-modal.html',
  styleUrl: './facture-print-modal.scss',
})
export class FacturePrintModal {
  @Input()
  facture?: Facturation;

  @Input() show = false;

  @Output() closed = new EventEmitter<void>();
  @Output() cashier = new EventEmitter<Facturation>();

  print() {
    window.print();
  }

  close() {
    this.closed.emit();
  }

  sendToCashier() {
    this.cashier.emit(this.facture);
  }
}
