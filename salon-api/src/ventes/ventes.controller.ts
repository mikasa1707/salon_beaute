import {
  Controller,
  Get,
  Param,
  Query,
  Patch,
  Body,
  Post,
} from '@nestjs/common';
import { VentesService } from './ventes.service';

@Controller('ventes')
export class VentesController {
  constructor(private readonly service: VentesService) {}

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
    @Query('statutPaiement') statutPaiement = '',
  ) {
    return this.service.findAll(
      Number(page),
      Number(limit),
      search,
      statutPaiement,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }

  @Patch(':id/annuler')
  cancel(@Param('id') id: number) {
    return this.service.cancelVente(+id);
  }

  @Patch(':id/paiement')
  updatePaiement(
    @Param('id') id: number,
    @Body()
    dto: {
      montant: number;
    },
  ) {
    return this.service.updatePaiement(+id, dto.montant);
  }
}
