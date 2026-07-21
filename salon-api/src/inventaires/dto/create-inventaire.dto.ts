import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateInventaireDto {
  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsArray()
  lignes!: {
    produitUniteId: number;
    stockReel: number;
  }[];
}
