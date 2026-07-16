import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ModalComponent } from '../../modal/modal';
import { PosNumberPadComponent } from '../pos-number-pad/pos-number-pad';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-pos-payment-modal',
  standalone: true,
  imports: [ModalComponent, PosNumberPadComponent, CurrencyPipe],
  templateUrl: './pos-payement-modal.html',
})
export class PosPaymentModal {
  @Input() show = false;
  @Input() total = 0;
  @Output() closed = new EventEmitter<void>();

  @Output() confirm = new EventEmitter<{ mode: string; montant: number }>();

  montant = 0;
  mode = 'ESPECE';

  close() {
    this.closed.emit();
  }

  validate() {
    this.confirm.emit({
      mode: this.mode,
      montant: this.montant,
    });
  }
}
