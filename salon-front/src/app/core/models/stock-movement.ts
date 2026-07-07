import { Produit } from "./produit";

export interface StockMovement {

    id: number;

    produit: Produit;

    type: 'IN' | 'OUT' | 'ADJUST';

    quantite: number;

    commentaire?: string;

    date: Date;

}