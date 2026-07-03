import { IsNumber } from 'class-validator';

export class CreateFacturationFromReservationDto {
  @IsNumber()
  reservation_id!: number;
}
