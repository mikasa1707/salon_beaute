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

import { UnitesMesureService } from './unites-mesure.service';
import { CreateUniteMesureDto } from './dto/create-unites-mesure.dto';
import { UpdateUnitesMesureDto } from './dto/update-unites-mesure.dto';

@Controller('unites-mesure')
export class UnitesMesureController {
  constructor(private readonly service: UnitesMesureService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.service.findAll(
      Number(page) || 1,
      Number(limit) || 10,
      search ?? '',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateUniteMesureDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUnitesMesureDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
