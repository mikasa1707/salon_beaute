export interface Produit {

    id: number;

    nom: string;

    codeBarre?: string;

    marque?: string;

    prixAchat: number;

    prixVente: number;

    stockMinimum: number;

    actif: boolean;

}