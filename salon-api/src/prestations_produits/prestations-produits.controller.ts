import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { PrestationProduitsService } from './prestations_produits.service';
import { CreatePrestationProduitDto } from './dto/create-prestation-produit.dto';

@Controller('prestations-produits')
export class PrestationProduitsController {
  constructor(private readonly service: PrestationProduitsService) {}

  @Get(':id/produits')
  findAll(@Param('id') id: string) {
    return this.service.findByPrestation(+id);
  }

  @Post(':id/produits')
  create(
    @Param('id') id: string,

    @Body() dto: CreatePrestationProduitDto,
  ) {
    return this.service.create(+id, dto);
  }

  @Delete('produits/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
