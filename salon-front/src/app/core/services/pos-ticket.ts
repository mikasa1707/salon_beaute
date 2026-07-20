import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { PosTicket } from '../models/posTicket';
import { VenteProduit } from '../models/vente-produit';

@Injectable({
  providedIn: 'root',
})
export class PosTicketService {
  private ticketsSubject = new BehaviorSubject<PosTicket[]>([]);

  tickets$ = this.ticketsSubject.asObservable();

  private activeTicketSubject = new BehaviorSubject<PosTicket | null>(null);

  activeTicket$ = this.activeTicketSubject.asObservable();

  constructor() {
    this.restore();
  }

  get tickets() {
    return this.ticketsSubject.value;
  }

  get activeTicket() {
    return this.activeTicketSubject.value;
  }

  // ============================
  // CREATION TICKET
  // ============================

  createTicket(label = 'Vente libre') {
    const ticket: PosTicket = {
      id: crypto.randomUUID(),

      label,

      items: [],

      remise: 0,

      totalProduits: 0,

      totalPrestations: 0,

      total: 0,

      createdAt: new Date(),

      updatedAt: new Date(),
    };

    const tickets = [...this.tickets, ticket];

    this.ticketsSubject.next(tickets);

    this.setActive(ticket.id);

    this.save();

    return ticket;
  }

  // ============================
  // CHANGER TICKET
  // ============================

  setActive(id: string) {
    const ticket = this.tickets.find(x => x.id === id);

    if (ticket) {
      this.activeTicketSubject.next(ticket);
    }
  }

  // ============================
  // AJOUT PRODUIT
  // ============================

  addItem(item: VenteProduit) {
    let ticket = this.activeTicket;

    if (!ticket) {
      ticket = this.createTicket();
    }

    const items = [...ticket.items];

    const existing = items.find(x => x.id === item.id && x.prestation?.id === item.prestation?.id);

    if (existing && !existing.locked) {
      existing.quantite++;

      existing.total = existing.quantite * Number(existing.prix);
    } else {
      items.push({
        ...item,

        id: Date.now(),

        locked: false,
      });
    }

    ticket.items = items;

    this.calculate(ticket);

    this.update(ticket);
  }

  // ============================
  // CALCUL TOTAL
  // ============================

  calculate(ticket: PosTicket) {
    ticket.total = ticket.items.reduce((sum, item) => sum + Number(item.total), 0);

    ticket.updatedAt = new Date();
  }

  // ============================
  // UPDATE
  // ============================

  update(ticket: PosTicket) {
    const tickets = this.tickets.map(t => (t.id === ticket.id ? ticket : t));

    this.ticketsSubject.next(tickets);

    this.activeTicketSubject.next(ticket);

    this.save();
  }

  // ============================
  // SUPPRESSION
  // ============================

  closeTicket(id: string) {
    const tickets = this.tickets.filter(x => x.id !== id);

    this.ticketsSubject.next(tickets);

    if (this.activeTicket?.id === id) {
      this.activeTicketSubject.next(tickets[0] ?? null);
    }

    this.save();
  }

  // ============================
  // STORAGE
  // ============================

  save() {
    localStorage.setItem('pos-tickets', JSON.stringify(this.tickets));
  }

  restore() {
    const data = localStorage.getItem('pos-tickets');

    if (data) {
      const tickets = JSON.parse(data);

      this.ticketsSubject.next(tickets);

      this.activeTicketSubject.next(tickets[0] ?? null);
    }
  }
}
