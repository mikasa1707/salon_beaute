import { PartialType } from '@nestjs/swagger';
import { CreateStockConsumptionDto } from './create-stock-consumption.dto';

export class UpdateStockConsumptionDto extends PartialType(CreateStockConsumptionDto) {}
