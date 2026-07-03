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

import { PaiementsService } from './paiements.service';
import { CreatePaiementDto } from './dto/create-paiement.dto';
import { UpdatePaiementDto } from './dto/update-paiement.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PersonnelRole } from 'src/personnels/entities/personnel.entity';

@Controller('paiements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaiementsController {
  constructor(private readonly service: PaiementsService) {}

  @Post()
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  create(@Body() dto: CreatePaiementDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
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
  update(@Param('id') id: string, @Body() dto: UpdatePaiementDto) {
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
