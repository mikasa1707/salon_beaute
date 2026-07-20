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
  prix: number;
  stock_minimum: number;
  couleur: string;
  actif: boolean;
}
