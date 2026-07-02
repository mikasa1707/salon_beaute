import { IsNumber, IsOptional } from 'class-validator';

export class CreateVenteProduitDto {
  @IsNumber()
  vente_id!: number;

  @IsNumber()
  produit_id!: number;

  @IsNumber()
  quantite!: number;

  @IsNumber()
  prix_unitaire!: number;

  @IsOptional()
  @IsNumber()
  total?: number;
}
