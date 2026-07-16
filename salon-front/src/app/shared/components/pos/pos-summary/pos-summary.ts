import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosService } from '../../../../core/services/pos';

@Component({
  selector: 'app-pos-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pos-summary.html',
  styleUrl: './pos-summary.scss',
})
export class PosSummaryComponent {
  @Output() checkout = new EventEmitter<void>();
  @Output() payment = new EventEmitter<void>();

  total = 0;

  remise = 0;

  constructor(private readonly posService: PosService) {}

  ngOnInit() {
    this.posService.cart$.subscribe(() => {
      this.calculate();
    });
  }

  calculate() {
    this.total = this.posService.getTotal();
  }

  payer() {
    if (this.total <= 0) {
      return;
    }

    this.checkout.emit();
  }
}
