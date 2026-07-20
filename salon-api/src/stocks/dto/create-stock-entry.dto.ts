import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateStockEntryItemDto } from './create-stock-entry-item.dto';

export class CreateStockEntryDto {
  @IsString()
  @IsNotEmpty()
  reference!: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateStockEntryItemDto)
  items!: CreateStockEntryItemDto[];
}
