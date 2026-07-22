import { VenteProduit } from './vente-produit';
import { Facturation } from './facturation';
import { Reservation } from './reservation';

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
    client?: {
      id: number;
      nom?: string;
      prenom?: string;
      telephone?: string;
    };
  };
  paiements?: any[];
  statutPaiement: StatutPaiement;
}

export type StatutPaiement = 'PAYE' | 'PARTIEL' | 'NON_PAYE';
