import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';

import { PrestationsRecettesService } from './prestations-recettes.service';
import { CreatePrestationRecetteDto } from './dto/create-prestations-recette.dto';
import { CreatePrestationRecetteBulkDto } from './dto/create-prestations-recette-bulk.dto';

@Controller('prestations-recettes')
export class PrestationsRecettesController {
  constructor(private readonly service: PrestationsRecettesService) {}

  @Get('prestation/:id')
  findByPrestation(@Param('id') id: string) {
    return this.service.findByPrestation(+id);
  }

  @Post('prestation/:id')
  create(@Param('id') id: string, @Body() dto: CreatePrestationRecetteDto) {
    return this.service.create(+id, dto);
  }

  @Post('prestation/:id/bulk')
  createBulk(
    @Param('id') id: string,
    @Body() dto: CreatePrestationRecetteBulkDto,
  ) {
    return this.service.createBulk(+id, dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: { quantite: number }) {
    return this.service.update(+id, body.quantite);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
