import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import {
  CashMovementType,
  CashMovementDirection,
} from '../entities/cash-movement.entity';

export class CreateCashMovementDto {
  @IsEnum(CashMovementType)
  type!: CashMovementType;

  @IsEnum(CashMovementDirection)
  direction!: CashMovementDirection;

  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  reference?: string;
}
