import { ProduitUnite } from './produit-unite';

export interface StockConsumptionItem {
  id: number;
  produitUnite: ProduitUnite;
  quantite: number;
}

export interface StockConsumption {
  id: number;
  numero: string;
  motif: string;
  salonId: number;
  archive: boolean;
  createdAt: Date;
  items: StockConsumptionItem[];
  createdBy?: {
    id: number;
    nom: string;
    prenom: string;
  };
}

export interface CreateStockConsumption {
  motif: string;
  items: {
    produitUniteId: number;
    quantite: number;
  }[];
}
