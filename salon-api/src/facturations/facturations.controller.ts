import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  Get,
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
  // GET FACTURE BY ID
  // =========================
  @Get(':id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.facturationsService.findOne(id);
  }
}
