export class CreateProduitUniteDto {
  nom!: string;
  code!: string;
  stock!: number;
  prix!: number;
  stock_minimum!: number;
  conversion!: number;
  actif?: boolean;
  produit_id!: number;
  unite_mesure_id!: number;
}
