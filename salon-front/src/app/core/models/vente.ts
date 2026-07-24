import { VenteProduit } from './vente-produit';
import { Facturation } from './facturation';
import { Reservation } from './reservation';
import { Client } from './client';

export interface Vente {
  id: number;
  numero: string;
  total: number;
  total_prestations: number;
  total_produits: number;
  remise: number;
  // Paiement
  modePaiement?: string;
  // Statut métier
  statut: string;
  // Annulation
  isCancelled: boolean;
  cancelledAt?: Date;
  // Dates
  created_at: Date;
  // Relations
  produits: VenteProduit[];
  facture?: Facturation;
  reservation?: {
    client?: Client;
  };
  paiements?: any[];
  statutPaiement: StatutPaiement;
  montantPaye?: number;
  client?: Client;
}

export type StatutPaiement = 'PAYE' | 'PARTIEL' | 'NON_PAYE';
