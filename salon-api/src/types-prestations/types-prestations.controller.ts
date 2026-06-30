import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TypesPrestationsService } from './types-prestations.service';
import { CreateTypesPrestationDto } from './dto/create-types-prestation.dto';
import { UpdateTypesPrestationDto } from './dto/update-types-prestation.dto';

@Controller('types-prestations')
export class TypesPrestationsController {
  constructor(private readonly typesPrestationsService: TypesPrestationsService) {}

  @Post()
  create(@Body() createTypesPrestationDto: CreateTypesPrestationDto) {
    return this.typesPrestationsService.create(createTypesPrestationDto);
  }

  @Get()
  findAll() {
    return this.typesPrestationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typesPrestationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTypesPrestationDto: UpdateTypesPrestationDto) {
    return this.typesPrestationsService.update(+id, updateTypesPrestationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typesPrestationsService.remove(+id);
  }
}
