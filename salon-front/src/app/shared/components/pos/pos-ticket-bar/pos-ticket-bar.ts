import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosService } from '../../../../core/services/pos';
import { PosTicket } from '../../../../core/models/posTicket';

@Component({
  selector: 'app-pos-ticket-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pos-ticket-bar.html',
  styleUrl: './pos-ticket-bar.scss',
})
export class PosTicketBar {
  tickets: PosTicket[] = [];

  activeId = '';

  constructor(
    private readonly posService: PosService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.posService.tickets$.subscribe(tickets => {
      this.tickets = tickets;
      this.cdr.detectChanges();
    });

    this.posService.activeTicket$.subscribe(ticket => {
      this.activeId = ticket?.id ?? '';
      this.cdr.detectChanges();
    });
  }

  select(ticket: PosTicket) {
    this.posService.setActive(ticket.id);
    this.cdr.detectChanges();
  }

  newTicket() {
    this.posService.createTicket();
    this.cdr.detectChanges();
  }

  remove(ticket: PosTicket) {
    if (this.tickets.length === 1) {
      if (!confirm('Supprimer ce dernier ticket ?')) {
        return;
      }
    }
    if (ticket.items.length) {
      if (!confirm('Supprimer ce ticket ?')) {
        return;
      }
    }

    this.posService.removeTicket(ticket.id);
    this.cdr.detectChanges();
  }
}
