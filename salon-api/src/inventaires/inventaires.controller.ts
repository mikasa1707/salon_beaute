import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InventairesService } from './inventaires.service';
import { CreateInventaireDto } from './dto/create-inventaire.dto';
import { UpdateInventaireDto } from './dto/update-inventaire.dto';

@Controller('inventaires')
export class InventairesController {
  constructor(private readonly inventairesService: InventairesService) {}

  @Post()
  create(@Body() createInventaireDto: CreateInventaireDto) {
    return this.inventairesService.create(createInventaireDto);
  }

  @Get()
  findAll() {
    return this.inventairesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventairesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInventaireDto: UpdateInventaireDto) {
    return this.inventairesService.update(+id, updateInventaireDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventairesService.remove(+id);
  }
}
