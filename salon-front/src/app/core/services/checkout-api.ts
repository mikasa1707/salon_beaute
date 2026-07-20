import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environnements/environnement';
import { Vente } from '../models/vente';

import { VenteProduit } from '../models/vente-produit';

export interface CheckoutPaymentDto {
  modePaiement: 'ESPECES' | 'MVOLA' | 'ORANGE_MONEY' | 'AIRTEL_MONEY' | 'CARTE' | 'AUTRE';
  montant: number;
  montantrecu?: number;
  montantrendu?: number;
  monnaie?: number;
  referencePaiement?: string;
  numeroPaiement?: string;
}

export interface CheckoutPosDto {
  ticketId: string;
  factureId?: number;
  items: VenteProduit[];
  total: number;
  remise: number;
  paiement: CheckoutPaymentDto;
}

@Injectable({
  providedIn: 'root',
})
export class CheckoutApi {
  private readonly url = `${environment.apiUrl}/checkout`;

  constructor(private readonly http: HttpClient) {}

  /**
   * POS libre
   */
  checkoutPos(dto: CheckoutPosDto): Observable<Vente> {
    return this.http.post<Vente>(`${this.url}/pos`, dto);
  }

  /**
   * Facture issue réservation
   */
  checkoutFacture(factureId: number): Observable<Vente> {
    return this.http.post<Vente>(`${this.url}/${factureId}`, {});
  }

  /**
   * Annulation vente
   */
  cancelVente(venteId: number): Observable<any> {
    return this.http.post(`${this.url}/cancel/${venteId}`, {});
  }
}
