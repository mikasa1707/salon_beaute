import { IsNumber } from 'class-validator';

export class CreateInventaireDto {
  @IsNumber()
  produit_id!: number;

  @IsNumber()
  quantite_theorique!: number;

  @IsNumber()
  quantite_reelle!: number;
}
