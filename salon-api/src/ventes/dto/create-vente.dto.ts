import {
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVenteProduitDto {
  @IsNumber()
  produit_id!: number;

  @IsNumber()
  quantite!: number;

  @IsNumber()
  prix_unitaire!: number;
}

export class CreateVenteDto {
  @IsOptional()
  @IsNumber()
  reservation_id?: number;

  @IsOptional()
  @IsNumber()
  remise?: number;

  @IsOptional()
  @IsNumber()
  total?: number;

  @IsOptional()
  @IsNumber()
  total_prestations?: number;

  @IsOptional()
  @IsNumber()
  total_produits?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVenteProduitDto)
  produits?: CreateVenteProduitDto[];
}
