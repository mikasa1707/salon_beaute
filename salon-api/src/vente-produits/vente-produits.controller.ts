import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { VenteProduitsService } from './vente-produits.service';
import { CreateVenteProduitDto } from './dto/create-vente-produit.dto';
import { UpdateVenteProduitDto } from './dto/update-vente-produit.dto';

@Controller('vente-produits')
export class VenteProduitsController {
  constructor(private readonly service: VenteProduitsService) {}

  @Post()
  create(@Body() dto: CreateVenteProduitDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVenteProduitDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
