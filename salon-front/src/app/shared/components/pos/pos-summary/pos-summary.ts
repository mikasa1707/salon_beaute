import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
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
  @Output() payment = new EventEmitter<void>();

  total = 0;
  totalProduits = 0;
  totalPrestations = 0;
  remise = 0;

  constructor(
    private readonly posService: PosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.posService.activeTicket$.subscribe(ticket => {
      console.log(ticket)
      if (ticket) {
        this.total = ticket.total;
        this.totalProduits = ticket.totalProduits;
        this.totalPrestations = ticket.totalPrestations;
        this.remise = ticket.remise ?? 0;
        this.cdr.detectChanges();
      } else {
        this.reset();
      }
    });
  }

  reset() {
    this.total = 0;
    this.totalProduits = 0;
    this.totalPrestations = 0;
    this.remise = 0;
    this.cdr.detectChanges();
  }

  payer() {
    if (this.total <= 0) {
      return;
    }

    this.payment.emit();
  }
}
