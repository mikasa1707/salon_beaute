import { Prestation } from './prestation';
import { ProduitUnite } from './produit-unite';

export interface FacturationItem {
  id: number;
  produitUnite?: ProduitUnite;
  prestation?: Prestation;
  quantite: number;
  prix: number;
  total: number;
  label?: string;
}
