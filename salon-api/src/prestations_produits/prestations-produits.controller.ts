import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { PrestationProduitsService } from './prestations_produits.service';
import { TransferPrestationProduitDto } from './dto/transfer-prestation-produit.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PersonnelRole } from 'src/personnels/entities/personnel.entity';
import { UpdatePrestationProduitDto } from './dto/update-prestation-produit.dto';

@Controller('prestations-produits')
export class PrestationProduitsController {
  constructor(private readonly service: PrestationProduitsService) { }

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
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  /**
   * Produits liés à une prestation
   * (utile plus tard)
   */
  @Get('prestation/:id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  findByPrestation(@Param('id') id: string) {
    return this.service.findByPrestation(+id);
  }

  /**
   * Transfert ProduitUnite -> PrestationProduit
   */
  @Post('transfer')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  transfer(@Body() dto: TransferPrestationProduitDto) {
    return this.service.transfer(dto);
  }

  /**
   * Consommation après prestation terminée
   */
  @Post('consume')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  consume(
    @Body() produits: { prestationProduitId: number; quantite: number }[],
  ) {
    return this.service.consume(produits);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePrestationProduitDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
