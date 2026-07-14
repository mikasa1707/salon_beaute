import { ProduitUnite } from './produit-unite';

export interface TransferStockDto {
    produitUniteId: number;
    quantite: number;
}

export interface StockPrestation {
    id: number;
    produit: {
        nom: string;
    };
    unite: ProduitUnite;
    quantite: number;
}