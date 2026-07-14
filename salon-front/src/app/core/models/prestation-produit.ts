export interface PrestationProduit {
  id:number;
  quantite:number;
  produit:{
    id:number;
    nom:string;
  };
  unite:{
    id:number;
    nom:string;
  };
}