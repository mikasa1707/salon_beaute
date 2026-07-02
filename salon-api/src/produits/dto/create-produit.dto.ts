import { IsNumber, IsString } from 'class-validator';

export class CreateProduitDto {
  @IsNumber()
  marque_id!: number;

  @IsNumber()
  type_produit_id!: number;

  @IsString()
  nom!: string;

  @IsNumber()
  prix_achat!: number;

  @IsNumber()
  prix_vente!: number;
}
