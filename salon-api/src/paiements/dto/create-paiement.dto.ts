import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ModePaiement } from '../entities/paiement.entity';

export class CreatePaiementDto {
  @IsNumber()
  vente_id!: number;

  @IsEnum(ModePaiement)
  mode!: ModePaiement;

  @IsNumber()
  montant!: number;

  @IsOptional()
  @IsString()
  reference?: string;
}
