import { IsNumber, IsString } from 'class-validator';

export class CreatePrestationDto {
  @IsNumber()
  type_prestation_id!: number;

  @IsString()
  nom!: string;

  @IsNumber()
  duree!: number;

  @IsNumber()
  prix!: number;
}
