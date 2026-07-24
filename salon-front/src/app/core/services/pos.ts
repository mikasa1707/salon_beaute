import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { VenteProduit } from '../models/vente-produit';
import { Facturation } from '../models/facturation';
import { PosTicket } from '../models/posTicket';
import { Vente } from '../models/vente';

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

  findTicketByVente(label: string) {
    return this.tickets.find(t => t.label === label);
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

  createTicket(label?: string) {
    const ticket: PosTicket = {
      id: crypto.randomUUID(),
      label: label ?? `Ticket ${this.ticketCounter++}`,
      items: [],
      totalProduits: 0,
      totalPrestations: 0,
      total: 0,
      remise: 0,
      montantPaye: 0,
      reste: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      mode: 'NEW',
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

  // loadFacture(facture: Facturation) {
  //   const items: VenteProduit[] = facture.items.map(item => ({
  //     id: item.id,
  //     label: item.label,
  //     nomComplet: item.label,
  //     quantite: Number(item.quantite),
  //     prix: Number(item.prix),
  //     total: Number(item.prix) * Number(item.quantite),
  //     totalPrestations: Number(item.prix) * Number(item.quantite),
  //     produit: item.produitUnite ?? undefined,
  //     prestation: item.prestation ?? undefined,
  //     locked: true,
  //   }));

  //   const ticket = this.createTicket(`FAC-${facture.numero}`);
  //   ticket.facturation = facture;
  //   ticket.items = items;
  //   this.calculate(ticket);

  //   this.update(ticket);
  // }

  loadFacture(facture: Facturation) {
    const ticket: PosTicket = {
      id: crypto.randomUUID(),
      factureId: facture.id,
      label: `${facture.numero}`,
      facturation: facture,
      client: facture.reservation.client,
      items: facture.items.map(item => ({
        ...item,
      })),
      totalProduits: 0,
      totalPrestations: Number(facture.total),
      total: Number(facture.total),
      remise: 0,
      montantPaye: 0,
      reste: Number(facture.total),
      createdAt: new Date(),
      updatedAt: new Date(),
      mode: 'FACTURE',
    };

    this.tickets.push(ticket);
    this.ticketsSubject.next(this.tickets);
    this.activeTicketSubject.next(ticket);
    this.save();
    return ticket;
  }

  // ==========================
  // LOAD VENTE
  // ==========================

  loadVente(vente: Vente) {
    const ticket: PosTicket = {
      id: crypto.randomUUID(),
      venteId: vente.id,
      label: vente.numero ?? this.generateNumeroVente(vente.id, vente.created_at),
      client: vente.client,
      facturation: vente.facture,
      items: vente.produits ?? [],
      totalProduits: Number(vente.total_produits ?? 0),
      totalPrestations: Number(vente.total_prestations ?? 0),
      total: Number(vente.total ?? 0),
      remise: Number(vente.remise ?? 0),
      montantPaye: Number(vente.montantPaye ?? 0),
      reste: Number(vente.total ?? 0) - Number(vente.montantPaye ?? 0),
      createdAt: new Date(vente.created_at),
      updatedAt: new Date(),
      mode: 'VENTE_EDIT',
    };

    const exists = this.tickets.find(t => t.venteId === vente.id);

    if (exists) {
      this.setActive(exists.id);
      return exists;
    }

    this.tickets.push(ticket);
    this.ticketsSubject.next(this.tickets);
    this.activeTicketSubject.next(ticket);
    this.save();
    return ticket;
  }

  private generateNumeroVente(id: number, _date: Date): string {
    _date = new Date(_date);
    const date = _date.getFullYear().toString().slice(2) + String(_date.getMonth() + 1).padStart(2, '0') + String(_date.getDate()).padStart(2, '0');

    const prefix = `V${date}`;

    return `${prefix}-${id.toString().padStart(4, '0')}`;
  }

  // loadVente(vente: Vente) {
  //   const ticket: PosTicket = {
  //     id: crypto.randomUUID(),

  //     venteId: vente.id,
  //     label: this.generateNumeroVente(vente.id, vente.created_at),
  //     // label: 'V'+ vente.created_at,
  //     facturation: vente.facture,
  //     client: vente.client ?? vente.reservation?.client,

  //     items: vente.produits,

  //     total: Number(vente.total),
  //     totalProduits: Number(vente.total_produits),
  //     totalPrestations: Number(vente.total_prestations),
  //     remise: Number(vente.remise),

  //     montantPaye: Number(vente.montantPaye),
  //     reste: Number(vente.total) - Number(vente.montantPaye),

  //     createdAt: vente.created_at,
  //     updatedAt: vente.created_at, // ou vente.updated_at si tu l'as
  //   };

  //   this.tickets.push(ticket);
  //   this.setActive(ticket.id);
  // }

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
