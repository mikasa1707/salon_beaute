import { IsString } from 'class-validator';

export class CreateTypeProduitDto {
  @IsString()
  nom!: string;
}
