import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { PersonnelRole } from '../entities/personnel.entity';

export class CreatePersonnelDto {
  @IsString()
  nom!: string;

  @IsString()
  prenom!: string;

  @IsString()
  specialite!: string;

  @IsString()
  telephone!: string;

  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsEnum(PersonnelRole)
  role!: PersonnelRole;

  @IsOptional()
  actif?: boolean;

  @IsOptional()
  @IsString()
  couleurAgenda?: string;
}
