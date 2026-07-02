import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  nom!: string;

  @IsString()
  prenom!: string;

  @IsString()
  telephone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
