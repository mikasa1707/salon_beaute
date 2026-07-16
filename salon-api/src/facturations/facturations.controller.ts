import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  Get,
  Query,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';

import { FacturationsService } from './facturations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PersonnelRole } from '../personnels/entities/personnel.entity';

@Controller('facturations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FacturationsController {
  constructor(private readonly facturationsService: FacturationsService) {}

  // =========================
  // CREATE FACTURE FROM RESERVATION
  // =========================
  @Post('from-reservation/:reservationId')
  @Roles(PersonnelRole.RECEPTION, PersonnelRole.ADMIN)
  createFromReservation(
    @Param('reservationId', ParseIntPipe)
    reservationId: number,
  ) {
    return this.facturationsService.createFromReservation(reservationId);
  }

  // =========================
  // GET ALL FACTURES
  // =========================
  @Get()
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number,

    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number,

    @Query('search')
    search = '',
  ) {
    return this.facturationsService.findAll(page, limit, search);
  }

  // =========================
  // GET FACTURE BY ID
  // =========================
  @Get(':id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.facturationsService.findOne(id);
  }
}
