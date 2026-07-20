import {
  IsInt,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateStockEntryItemDto {
  @IsInt()
  produitUniteId!: number;

  @IsNumber()
  @Min(0.001)
  quantite!: number;
}