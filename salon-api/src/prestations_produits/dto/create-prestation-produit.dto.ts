import { IsNumber } from 'class-validator';

export class CreatePrestationProduitDto {
  @IsNumber()
  produitId!: number;

  @IsNumber()
  uniteId!: number;

  @IsNumber()
  quantite!: number;
}
