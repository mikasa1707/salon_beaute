import { Prestation } from "./prestation";
import { Produit } from "./produit-unite";

export interface FacturationItem {

    id: number;

    prestation?: Prestation;

    produit?: Produit;

    quantite: number;

    prix: number;

}