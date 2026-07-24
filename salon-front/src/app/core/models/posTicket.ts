import { Client } from './client';
import { Facturation } from './facturation';
import { Reservation } from './reservation';
import { VenteProduit } from './vente-produit';

// export interface PosTicket {
//   id: string;

//   /**
//    * Nom affiché dans les onglets
//    * Ex :
//    * - Vente libre
//    * - Mme Rakoto
//    * - FAC-20260717-0001
//    */
//   venteId?: number;
//   label: string;
//   client?: Client;
//   reservation?: Reservation;
//   facturation?: Facturation;

//   /**
//    * Toutes les lignes affichées dans le POS.
//    * Les prestations provenant d'une facture sont
//    * converties en VenteProduit avec locked = true.
//    */
//   items: VenteProduit[];
//   remise: number;
//   monnaie?: number;
//   totalProduits: number;
//   totalPrestations: number;
//   total: number;
//   montantPaye?: number;
//   reste?: number;
//   createdAt: Date;
//   updatedAt: Date;
// }

export interface PosTicket {
  id: string; // UUID frontend
  venteId?: number; // ID SQL si édition vente
  factureId?: number; // ID SQL si paiement facture
  label: string;
  facturation?: Facturation;
  client?: Client;
  items: VenteProduit[];
  totalProduits: number;
  totalPrestations: number;
  total: number;
  remise: number;
  montantPaye: number;
  reste: number;
  createdAt: Date;
  updatedAt: Date;
  mode?: 'NEW' | 'VENTE_EDIT' | 'FACTURE';
}
