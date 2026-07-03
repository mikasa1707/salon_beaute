import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReservationPrestationDto {
  @IsNumber()
  prestation_id!: number;

  @IsOptional()
  @IsNumber()
  quantite: number = 1;

  @IsOptional()
  @IsString()
  remarque?: string;
}
