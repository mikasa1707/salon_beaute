export interface ProduitUnite {
  id:number;
  nom:string;
  code:string;
  stock:number;
  produit:{
    id:number;
    nom:string;
  };
}