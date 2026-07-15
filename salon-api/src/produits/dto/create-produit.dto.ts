import { IsNumber, IsString } from 'class-validator';

export class CreateProduitDto {
  @IsNumber()
  marqueId!: number;

  @IsNumber()
  typeProduitId!: number;

  @IsString()
  nom!: string;

  @IsNumber()
  prix_achat!: number;

  @IsNumber()
  prix_vente!: number;

  @IsNumber()
  uniteConsommationId!: number;
}
