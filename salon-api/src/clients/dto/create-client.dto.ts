import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { ClientGenre } from '../entities/client.entity';

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

  @IsOptional()
  @IsString()
  adresse?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsEnum(ClientGenre)
  genre!: ClientGenre;
}
