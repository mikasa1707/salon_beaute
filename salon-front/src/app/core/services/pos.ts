import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { VenteProduit } from '../models/vente-produit';
import { Facturation } from '../models/facturation';
import { PosTicket } from '../models/posTicket';

@Injectable({
  providedIn: 'root',
})
export class PosService {
  // ==========================
  // TICKETS
  // ==========================

  private readonly STORAGE_KEY = 'salon_pos_tickets';
  private ticketsSubject = new BehaviorSubject<PosTicket[]>([]);
  tickets$ = this.ticketsSubject.asObservable();
  private activeTicketSubject = new BehaviorSubject<PosTicket | null>(null);
  activeTicket$ = this.activeTicketSubject.asObservable();

  private ticketCounter = 1;

  constructor() {
    this.restore();
  }

  findTicketByFacture(id: number) {
    return this.tickets.find(t => t.facturation?.id === id);
  }

  // ==========================
  // GETTERS
  // ==========================

  get tickets() {
    return this.ticketsSubject.value;
  }

  get activeTicket() {
    return this.activeTicketSubject.value;
  }

  get cart(): VenteProduit[] {
    return this.activeTicket?.items ?? [];
  }

  // ==========================
  // CREATION TICKET
  // ==========================

  createTicket(label? : string) {
    if (!label) {
      label = `Vente ${this.ticketCounter++}`;
    }
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
    this.activeTicketSubject.next(ticket);
    this.save();
    return ticket;
  }

  // ==========================
  // CHANGER TICKET
  // ==========================

  setActive(id: string) {
    const ticket = this.tickets.find(x => x.id === id);
    if (!ticket) {
      return;
    }
    this.activeTicketSubject.next(ticket);
    this.save();
  }

  // ==========================
  // LOAD FACTURE
  // ==========================
  // FacturationItem devient VenteProduit
  // Toutes les lignes facture sont LOCK

  loadFacture(facture: Facturation) {
    const items: VenteProduit[] = facture.items.map(item => ({
      id: item.id,
      label: item.label,
      nomComplet: item.label,
      quantite: Number(item.quantite),
      prix: Number(item.prix),
      total: Number(item.prix) * Number(item.quantite),
      totalPrestations: Number(item.prix) * Number(item.quantite),
      produit: item.produitUnite ?? undefined,
      prestation: item.prestation ?? undefined,
      locked: true,
    }));

    const ticket = this.createTicket(`FAC-${facture.numero}`);
    ticket.facturation = facture;
    ticket.items = items;
    this.calculate(ticket);

    this.update(ticket);
  }

  // ==========================
  // ADD ITEM
  // ==========================

  addItem(item: VenteProduit) {
    let ticket = this.activeTicket;
    if (!ticket) {
      ticket = this.createTicket();
    }
    const items = [...ticket.items];
    const existing = items.find(x => x.id === item.id);
    if (existing) {
      // facture verrouillée
      if (existing.locked) {
        return;
      }
      existing.quantite++;
      existing.total = existing.quantite * Number(existing.prix);
    } else {
      items.push({
        ...item,
        quantite: item.quantite ?? 1,
        total: Number(item.prix) * (item.quantite ?? 1),
        locked: false,
      });
    }

    ticket.items = items;
    this.calculate(ticket);
    this.update(ticket);
  }

  // ==========================
  // REMOVE ITEM
  // ==========================

  removeItem(id: number) {
    const ticket = this.activeTicket;

    if (!ticket) return;

    const item = ticket.items.find(x => x.id === id);

    if (item?.locked) return;

    ticket.items = ticket.items.filter(x => x.id !== id);

    this.calculate(ticket);

    this.update(ticket);
  }

  // ==========================
  // UPDATE QUANTITY
  // ==========================

  updateQuantity(id: number, quantity: number) {
    const ticket = this.activeTicket;

    if (!ticket) return;

    const item = ticket.items.find(x => x.id === id);

    if (!item || item.locked) return;

    if (quantity <= 0) {
      this.removeItem(id);

      return;
    }

    item.quantite = quantity;

    item.total = quantity * Number(item.prix);

    this.calculate(ticket);

    this.update(ticket);
  }

  // ==========================
  // CALCUL
  // ==========================

  calculate(ticket: PosTicket) {
    ticket.total = ticket.items.reduce((sum, item) => sum + Number(item.total), 0);
    ticket.totalProduits = ticket.items.filter(x => x.produit).reduce((sum, item) => sum + Number(item.total), 0);
    ticket.totalPrestations = ticket.items.filter(x => x.prestation).reduce((sum, item) => sum + Number(item.total), 0);
    ticket.updatedAt = new Date();
  }

  // ==========================
  // UPDATE TICKET
  // ==========================

  update(ticket: PosTicket) {
    const tickets = this.tickets.map(t => (t.id === ticket.id ? ticket : t));

    this.ticketsSubject.next(tickets);

    this.activeTicketSubject.next(ticket);

    this.save();
  }

  // ==========================
  // TOTAL ACTIF
  // ==========================

  getTotal() {
    return this.activeTicket?.total ?? 0;
  }

  getTotalProduits() {
    return this.activeTicket?.totalProduits ?? 0;
  }

  getTotalPrestations() {
    return this.activeTicket?.totalPrestations ?? 0;
  }

  // ==========================
  // FERMER TICKET
  // ==========================

  closeTicket(id: string) {
    const tickets = this.tickets.filter(x => x.id !== id);

    this.ticketsSubject.next(tickets);

    if (this.activeTicket?.id === id) {
      this.activeTicketSubject.next(tickets[0] ?? null);
    }

    this.save();
  }

  // ==========================
  // STORAGE
  // ==========================

  save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.ticketsSubject.value));
  }

  private restore() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) {
      this.createTicket();
      return;
    }

    if (this.tickets.length) {
      const numbers = this.tickets.map(t => {
        const match = t.label.match(/\d+$/);
        return match ? Number(match[0]) : 0;
      });

      this.ticketCounter = Math.max(...numbers, 0) + 1;
    }

    const tickets: PosTicket[] = JSON.parse(data);
    this.ticketsSubject.next(tickets);
    if (tickets.length) {
      this.activeTicketSubject.next(tickets[0]);
    }
  }

  removeTicket(id: string) {
    const tickets = this.tickets.filter(x => x.id !== id);
    this.ticketsSubject.next(tickets);
    if (this.activeTicketSubject.value?.id === id) {
      this.activeTicketSubject.next(tickets[0] ?? null);
    }
    this.save();
  }
}
