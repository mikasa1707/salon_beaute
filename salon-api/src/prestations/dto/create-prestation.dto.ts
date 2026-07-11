import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePrestationDto {
  @IsNumber()
  typePrestationId!: number;

  @IsString()
  nom!: string;

  @IsNumber()
  duree!: number;

  @IsNumber()
  prix!: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  personnelIds?: number[];
}
