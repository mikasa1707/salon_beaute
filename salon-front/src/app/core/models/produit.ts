import { Marque } from './marques';
import { TypeProduit } from './type-produit';
import { ProduitUnite } from './produit-unite';

export interface Produit {
  id:number;
  nom:string;
  prix_achat:number;
  prix_vente:number;
  marque:Marque;
  typeProduit:TypeProduit;
  unites:ProduitUnite[];
  stockTotal:number;
  isLowStock:boolean;
  actif:boolean;
}