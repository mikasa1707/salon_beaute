import { IsNumber } from 'class-validator';

export class CreatePrestationRecetteDto {
  @IsNumber()
  produitId!: number;

  @IsNumber()
  uniteMesureId!: number;

  @IsNumber()
  quantite!: number;
}
