export interface PrestationProduit {
  id:number;
  quantite:number;
  produit:{
    id:number;
    nom:string;
  };
  unites:{
    id:number;
    nom:string;
  };
}