import { IsNumber } from 'class-validator';

export class CreateStockDto {
  @IsNumber()
  produit_id!: number;

  @IsNumber()
  quantite!: number;
}
