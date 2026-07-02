import { IsString } from 'class-validator';

export class CreateMarqueDto {
  @IsString()
  nom!: string;
}
