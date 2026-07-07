import { Produit } from "./produit";

export interface VenteProduit {

    id: number;

    produit: Produit;

    quantite: number;

    prix: number;

}