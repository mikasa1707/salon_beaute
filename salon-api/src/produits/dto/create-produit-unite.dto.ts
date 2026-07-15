export class CreateProduitUniteDto {
  nom!: string;
  code!: string;
  stock!: number;
  prix!: number;
  stock_minimum!: number;
  uniteMesureId!: number;
  conversion!: number;
  actif?: boolean;
}
