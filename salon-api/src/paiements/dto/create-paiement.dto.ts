import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ModePaiement } from '../entities/paiement.entity';

export class CreatePaiementDto {
  @IsNumber()
  vente_id!: number;

  @IsEnum(ModePaiement)
  modePaiement!: ModePaiement;

  @IsNumber()
  montant!: number;

  @IsNumber()
  montantrecu!: number;

  @IsNumber()
  montantrendu!: number;

  @IsOptional()
  @IsString()
  referencePaiement?: string;

  @IsOptional()
  @IsString()
  numeroPaiement?: string;

}
