export class CreatePrestationRecetteBulkDto {
  produits!: {
    produitId: number;
    quantite: number;
  }[];
}
