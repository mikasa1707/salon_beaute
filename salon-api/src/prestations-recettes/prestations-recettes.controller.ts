import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PrestationsRecettesService } from './prestations-recettes.service';
import { CreatePrestationRecetteDto } from './dto/create-prestations-recette.dto';
import { UpdatePrestationsRecetteDto } from './dto/update-prestations-recette.dto';

@Controller('prestations-recettes')
export class PrestationsRecettesController {
  constructor(private readonly prestationsRecettesService: PrestationsRecettesService) {}

  @Post()
  create(@Body() createPrestationsRecetteDto: CreatePrestationRecetteDto) {
    return this.prestationsRecettesService.create(createPrestationsRecetteDto);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prestationsRecettesService.findByPrestation(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePrestationsRecetteDto: UpdatePrestationsRecetteDto) {
    return this.prestationsRecettesService.update(+id, updatePrestationsRecetteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prestationsRecettesService.remove(+id);
  }
}
