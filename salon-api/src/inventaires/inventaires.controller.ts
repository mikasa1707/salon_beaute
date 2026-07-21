import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  Patch,
} from '@nestjs/common';

import { InventairesService } from './inventaires.service';
import { CreateInventaireDto } from './dto/create-inventaire.dto';

@Controller('inventaires')
export class InventairesController {
  constructor(private readonly service: InventairesService) {}

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ) {
    return this.service.findAll(
      Number(page) || 1,
      Number(limit) || 10,
      search || '',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(Number(id));
  }

  @Post()
  create(@Body() dto: CreateInventaireDto) {
    return this.service.create(dto);
  }

  @Patch(':id/validate')
  validate(@Param('id') id: number) {
    return this.service.validate(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.deactivate(Number(id));
  }
}
