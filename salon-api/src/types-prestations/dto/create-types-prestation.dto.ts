import { IsString } from 'class-validator';

export class CreateTypePrestationDto {
  @IsString()
  nom!: string;
}
