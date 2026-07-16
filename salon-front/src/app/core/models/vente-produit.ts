import { Prestation } from './prestation';
import { ProduitUnite } from './produit-unite';

export interface VenteProduit {
  id: number;
  nomComplet?: string;
  quantite: number;
  prix: number;
  total: number;
  produitUnite?: ProduitUnite;
  prestation?: Prestation;
  locked?:boolean;
  type?: 'PRODUIT' | 'PRESTATION';
}
