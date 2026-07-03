import {
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum FacturationStatus {
  UNPAID = 'UNPAID',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export class CreateFacturationItemDto {
  @IsNumber()
  prestation_id!: number;

  @IsNumber()
  quantite!: number;

  @IsNumber()
  prix!: number;

  @IsNumber()
  duree!: number;
}

export class CreateFacturationDto {
  @IsNumber()
  client_id!: number;

  @IsOptional()
  @IsNumber()
  reservation_id?: number;

  @IsNumber()
  total!: number;

  @IsOptional()
  @IsEnum(FacturationStatus)
  status?: FacturationStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFacturationItemDto)
  items!: CreateFacturationItemDto[];
}
