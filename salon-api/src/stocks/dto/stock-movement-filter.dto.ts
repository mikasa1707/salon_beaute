import { IsOptional, IsEnum, IsInt, IsString } from 'class-validator';

import { Type } from 'class-transformer';

import { StockMovementType } from '../entities/stock-movements.entity';

export class StockMovementFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(StockMovementType)
  type?: StockMovementType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  produitUniteId?: number;
}
