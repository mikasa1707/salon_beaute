import { ProduitUnite } from './produit-unite';
import { Prestation } from './prestation';

export interface PosItem {
  id: number;
  label: string;
  type: 'PRODUIT' | 'PRESTATION';
  quantite: number;
  prix_unitaire: number;
  total: number;
  locked: boolean;
  produitUnite?: ProduitUnite;
  prestation?: Prestation;
}
