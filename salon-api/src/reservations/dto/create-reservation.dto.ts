import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum ReservationStatut {
  EN_ATTENTE = 'EN_ATTENTE',
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
  personnel_id!: number;

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
}
