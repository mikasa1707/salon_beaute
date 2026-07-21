export interface Inventaire {
  id: number;
  numero: string;
  reference?: string;
  note?: string;
  valide: boolean;
  created_at: string;
  nbLignes?: number;
  totalEcart?: number;
  hasEcart?: boolean;
  statut?: 'VALIDE' | 'EN_COURS';
  lignes?: InventaireLigne[];
}

export interface InventaireLigne {
  id: number;
  produitUnite: {
    id: number;
    nom: string;
    code: string;
    stock: number;
    produit: {
      id: number;
      nom: string;
    };
  };

  quantiteTheorique: number;
  quantiteReelle: number;
  ecart: number;
}
