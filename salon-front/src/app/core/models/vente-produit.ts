import { Prestation } from './prestation';
import { ProduitUnite } from './produit-unite';

export interface VenteProduit {
  id: number;
  label?: string;
  quantite: number;
  prix: number;
  total: number;
  produit?: ProduitUnite;
  prestation?: Prestation;
  locked?:boolean;
  couleur?: string;
  type?: 'PRODUIT' | 'PRESTATION';
}
