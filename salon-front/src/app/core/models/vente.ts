import { VenteProduit } from './vente-produit';
import { Facturation } from './facturation';

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
}
