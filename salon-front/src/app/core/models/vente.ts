import { VenteProduit } from "./vente-produit";

export interface Vente {

    id: number;

    numero: string;

    total: number;

    modePaiement: string;

    statut: string;

    date: Date;

    produits: VenteProduit[];

}