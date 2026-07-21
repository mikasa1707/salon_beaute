export interface CreateInventaireDto {
  reference?: string;
  note?: string;
  lignes: {
    produitUniteId: number;
    stockReel: number;
  }[];
}
