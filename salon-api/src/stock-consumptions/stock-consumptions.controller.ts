import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { StockConsumptionService } from './stock-consumptions.service';
import { CreateStockConsumptionDto } from './dto/create-stock-consumption.dto';

@Controller('stock-consumptions')
export class StockConsumptionController {
  constructor(private readonly service: StockConsumptionService) {}

  @Post()
  create(@Body() dto: CreateStockConsumptionDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
  ) {
    return this.service.findAll(Number(page), Number(limit), search);
  }
}
