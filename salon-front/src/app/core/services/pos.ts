import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { VenteProduit } from '../models/vente-produit';
import { Facturation } from '../models/facturation';

@Injectable({
  providedIn: 'root',
})
export class PosService {
  private cartSubject = new BehaviorSubject<VenteProduit[]>([]);
  cart$: Observable<VenteProduit[]> = this.cartSubject.asObservable();
  private factureSubject = new BehaviorSubject<Facturation | null>(null);
  facture$ = this.factureSubject.asObservable();

  // ==========================
  // GET CART
  // ==========================

  get cart(): VenteProduit[] {
    return this.cartSubject.value;
  }

  // ==========================
  // LOAD FACTURE
  // ==========================
  // Transformation FacturationItem -> VenteProduit
  // Les lignes facture sont verrouillées

  loadFacture(facture: Facturation) {
    this.factureSubject.next(facture);

    const items: VenteProduit[] = facture.items.map(item => ({
      id: item.id,
      label: item.nomComplet,
      quantite: Number(item.quantite),
      prix: Number(item.prix),
      total: Number(item.prix) * Number(item.quantite),
      produitUnite: item.produitUnite ?? undefined,
      prestation: item.prestation ?? undefined,
      // 🔒 venant de la facture
      locked: true,
    }));
    this.cartSubject.next(items);
  }

  // ==========================
  // ADD ITEM FROM POS
  // ==========================

  addItem(item: VenteProduit) {
    const current = [...this.cart];
    const existing = current.find(x => x.produitUnite?.id === item.produitUnite?.id && x.prestation?.id === item.prestation?.id);
    if (existing) {
      // Une prestation facture ne doit pas être fusionnée
      if (existing.locked) {
        return;
      }
      existing.quantite++;
      existing.total = existing.quantite * existing.prix;
    } else {
      current.push({
        ...item,
        quantite: item.quantite ?? 1,
        total: Number(item.prix) * (item.quantite ?? 1),

        // produit ajouté depuis POS
        locked: false,
      });
    }

    this.cartSubject.next(current);
  }

  // ==========================
  // REMOVE ITEM
  // ==========================

  removeItem(id: number) {
    const item = this.cart.find(x => x.id === id);
    // 🔒 impossible supprimer une ligne facture
    if (item?.locked) {
      return;
    }
    const updated = this.cart.filter(item => item.id !== id);
    this.cartSubject.next(updated);
  }

  // ==========================
  // UPDATE QUANTITY
  // ==========================

  updateQuantity(id: number, quantity: number) {
    const updated = this.cart.map(item => {
      // 🔒 ligne facture non modifiable
      if (item.id === id && item.locked) {
        return item;
      }
      if (item.id === id) {
        item.quantite = quantity;
        item.total = quantity * item.prix;
      }
      return item;
    });

    this.cartSubject.next(updated);
  }

  // ==========================
  // TOTAL
  // ==========================

  getTotal(): number {
    return this.cart.reduce((sum, item) => sum + Number(item.total), 0);
  }

  // ==========================
  // TOTAL PRODUITS
  // ==========================

  getTotalProduits(): number {
    return this.cart.filter(item => !!item.produitUnite).reduce((sum, item) => sum + Number(item.total), 0);
  }

  // ==========================
  // TOTAL PRESTATIONS
  // ==========================

  getTotalPrestations(): number {
    return this.cart.filter(item => !!item.prestation).reduce((sum, item) => sum + Number(item.total), 0);
  }

  // ==========================
  // RESET
  // ==========================

  clear() {
    this.cartSubject.next([]);
    this.factureSubject.next(null);
  }
}
