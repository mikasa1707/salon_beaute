import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { PrestationProduitsService } from './prestations_produits.service';
import { TransferPrestationProduitDto } from './dto/transfer-prestation-produit.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PersonnelRole } from 'src/personnels/entities/personnel.entity';

@Controller('prestations-produits')
export class PrestationProduitsController {
  constructor(private readonly service: PrestationProduitsService) {}

  /**
   * Stock disponible prestations
   */
  @Get()
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
    PersonnelRole.COIFFEUR,
    PersonnelRole.ESTHETICIEN,
  )
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNumber = page ? +page : 1;
    const limitNumber = limit ? +limit : 10;
    const searchString = search || '';
    return this.service.findAll(pageNumber, limitNumber, searchString);
  }

  /**
   * Détail stock prestation
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  /**
   * Produits liés à une prestation
   * (utile plus tard)
   */
  @Get('prestation/:id')
  findByPrestation(@Param('id') id: string) {
    return this.service.findByPrestation(+id);
  }

  /**
   * Transfert ProduitUnite -> PrestationProduit
   */
  @Post('transfer')
  transfer(@Body() dto: TransferPrestationProduitDto) {
    return this.service.transfer(dto);
  }

  /**
   * Consommation après prestation terminée
   */
  @Post('consume')
  consume(
    @Body() produits: { prestationProduitId: number; quantite: number }[],
  ) {
    return this.service.consume(produits);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
