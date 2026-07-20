import { Client } from './client';
import { Facturation } from './facturation';
import { Reservation } from './reservation';
import { VenteProduit } from './vente-produit';

export interface PosTicket {
  id: string;

  /**
   * Nom affiché dans les onglets
   * Ex :
   * - Vente libre
   * - Mme Rakoto
   * - FAC-20260717-0001
   */
  label: string;
  client?: Client;
  reservation?: Reservation;
  facturation?: Facturation;

  /**
   * Toutes les lignes affichées dans le POS.
   * Les prestations provenant d'une facture sont
   * converties en VenteProduit avec locked = true.
   */
  items: VenteProduit[];
  remise: number;
  monnaie?: number;
  totalProduits: number;
  totalPrestations: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}
