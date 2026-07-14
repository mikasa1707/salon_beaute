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
import {
  ReservationOrigine,
  ReservationStatut,
} from '../entities/reservation.entity';

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
