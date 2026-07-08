export interface ProduitUnite {
    id: number;
    nom: string;
    codeBarre?: string;
    stock: number;
    prix: number;
    stockMinimum: number;
    actif: boolean;
}