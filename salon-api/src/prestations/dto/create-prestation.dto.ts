import { IsNumber, IsString } from 'class-validator';

export class CreatePrestationDto {
  @IsNumber()
  typePrestationId!: number;

  @IsString()
  nom!: string;

  @IsNumber()
  duree!: number;

  @IsNumber()
  prix!: number;
}
