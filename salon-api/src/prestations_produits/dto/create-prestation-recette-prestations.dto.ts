import { IsNumber } from 'class-validator';

export class CreatePrestationProduitDto {
  @IsNumber()
  produitId!: number;

  @IsNumber()
  prestationId!: number;

  @IsNumber()
  quantite!: number;
}
