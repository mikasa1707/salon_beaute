import { Produit } from "./produit";

export interface ProduitUnite {
  id: number;
  nom: string;
  code: string;
  conversion: number;
  uniteMesure?: {
    id: number;
    nom: string;
    symbole: string;
  };
  stock: number;
  quantite?: number;
  prix: number;
  stock_minimum: number;
  couleur: string;
  actif: boolean;
  produit_id: number;
  unite_mesure_id: number;
  unites: string;
  produit?: Produit;
}
