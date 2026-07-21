import { Produit } from "./produit";

export interface StockMovement {

    id: number;
    produit: Produit;
    type: 'IN' | 'OUT' | 'ADJUST' | 'TRANSFERT';
    quantite: number;
    commentaire?: string;
    date: Date;

}