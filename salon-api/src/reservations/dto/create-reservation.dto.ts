import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateReservationPrestationDto } from './create-reservation-prestation.dto';

export enum ReservationStatut {
  EN_ATTENTE = 'EN_ATTENTE',
  ARRIVEE = 'ARRIVEE',
  CONFIRMEE = 'CONFIRMEE',
  EN_COURS = 'EN_COURS',
  TERMINEE = 'TERMINEE',
  ANNULEE = 'ANNULEE',
  ABSENT = 'ABSENT',
}

export enum ReservationOrigine {
  RENDEZ_VOUS = 'RENDEZ_VOUS',
  SANS_RDV = 'SANS_RDV',
  TELEPHONE = 'TELEPHONE',
  EN_LIGNE = 'EN_LIGNE',
}

export class CreateReservationDto {
  @IsNumber()
  client_id!: number;

  @IsNumber()
  personnel_ids!: number[];

  @IsDateString()
  date_debut!: Date;

  @IsDateString()
  date_fin!: Date;

  @IsEnum(ReservationStatut)
  statut!: ReservationStatut;

  @IsEnum(ReservationOrigine)
  origine!: ReservationOrigine;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReservationPrestationDto)
  prestations!: CreateReservationPrestationDto[];
}
