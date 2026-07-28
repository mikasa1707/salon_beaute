import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { StockConsumptionService } from './stock-consumptions.service';

import { CreateStockConsumptionDto } from './dto/create-stock-consumption.dto';

@Controller('stock-consumptions')
export class StockConsumptionController {
  constructor(private readonly service: StockConsumptionService) {}

  /**
   * Création consommation
   */
  @Post()
  create(@Body() dto: CreateStockConsumptionDto) {
    return this.service.create(dto);
  }

  /**
   * Liste historique
   */
  @Get()
  findAll(
    @Query('page')
    page = 1,

    @Query('limit')
    limit = 10,

    @Query('search')
    search = '',
  ) {
    return this.service.findAll(Number(page), Number(limit), search);
  }

  /**
   * Détail consommation
   */
  @Get(':id')
  findOne(
    @Param('id')
    id: number,
  ) {
    return this.service.findOne(Number(id));
  }

  /**
   * Modification consommation
   */
  @Put(':id')
  update(
    @Param('id')
    id: number,

    @Body()
    dto: CreateStockConsumptionDto,
  ) {
    return this.service.update(Number(id), dto);
  }

  /**
   * Archivage logique
   */
  @Delete(':id')
  archive(
    @Param('id')
    id: number,
  ) {
    return this.service.actif(Number(id));
  }
}
