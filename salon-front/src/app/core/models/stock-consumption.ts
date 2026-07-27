import { Produit } from './produit';
import { ProduitUnite } from './produit-unite';

export interface StockConsumption {
  id: number;
  produit: Produit;
  produitUnite: ProduitUnite;
  quantite: number;
  motif: string;
  createdAt: Date;
  createdBy?: {
    id: number;
    nom: string;
    prenom: string;
  };
}
