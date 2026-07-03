import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { VenteProduitsService } from './vente-produits.service';
import { CreateVenteProduitDto } from './dto/create-vente-produit.dto';
import { UpdateVenteProduitDto } from './dto/update-vente-produit.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PersonnelRole } from 'src/personnels/entities/personnel.entity';

@Controller('vente-produits')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VenteProduitsController {
  constructor(private readonly service: VenteProduitsService) {}

  @Post()
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  create(@Body() dto: CreateVenteProduitDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
    PersonnelRole.COIFFEUR,
    PersonnelRole.ESTHETICIEN,
  )
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
    PersonnelRole.COIFFEUR,
    PersonnelRole.ESTHETICIEN,
  )
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  update(@Param('id') id: string, @Body() dto: UpdateVenteProduitDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
