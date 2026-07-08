import { Prestation } from "./prestation";
import { ProduitUnite } from "./produit-unite";

export interface FacturationItem {

    id: number;

    prestation?: Prestation;

    produit?: ProduitUnite;

    quantite: number;

    prix: number;

}