export interface Stock {
  id: number;
  produitUniteId: number;
  produit: string;
  unite: string;
  code: string;
  stock: number;
  stockMinimum: number;
  prix: number;
  valeurStock: number;
}

export interface ProduitUniteStock {
  id: number;
  nom: string;
  code: string;
  stock: number;
  entry?: number;
  unite: string;
  produit: {
    id: number;
    nom: string;
  };
}

export interface StockEntryItem {
  produitUniteId: number;
  quantite: number;
}

export interface CreateStockEntryDto {
  reference?: string;
  note?: string;
  items: StockEntryItem[];
}
