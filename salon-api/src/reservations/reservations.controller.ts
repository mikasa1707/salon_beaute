import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationStatut } from './entities/reservation.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PersonnelRole } from 'src/personnels/entities/personnel.entity';

@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
    PersonnelRole.COIFFEUR,
    PersonnelRole.ESTHETICIEN,
  )
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.createReservation(createReservationDto);
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
    return this.reservationsService.findAll();
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
    return this.reservationsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
    PersonnelRole.COIFFEUR,
    PersonnelRole.ESTHETICIEN,
  )
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.updateReservation(
      +id,
      updateReservationDto,
    );
  }

  @Delete(':id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
    PersonnelRole.COIFFEUR,
    PersonnelRole.ESTHETICIEN,
  )
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(+id);
  }

  @Patch(':id/status')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
    PersonnelRole.COIFFEUR,
    PersonnelRole.ESTHETICIEN,
  )
  changeStatus(
    @Param('id') id: string,
    @Body('status') status: ReservationStatut,
  ) {
    return this.reservationsService.changeStatus(+id, status);
  }

  @Patch(':id/confirm')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
    PersonnelRole.COIFFEUR,
    PersonnelRole.ESTHETICIEN,
  )
  confirm(@Param('id') id: string) {
    return this.reservationsService.changeStatus(
      +id,
      ReservationStatut.CONFIRMEE,
    );
  }

  @Patch(':id/start')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
    PersonnelRole.COIFFEUR,
    PersonnelRole.ESTHETICIEN,
  )
  start(@Param('id') id: string) {
    return this.reservationsService.changeStatus(
      +id,
      ReservationStatut.EN_COURS,
    );
  }

  @Patch(':id/finish')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
    PersonnelRole.COIFFEUR,
    PersonnelRole.ESTHETICIEN,
  )
  finish(@Param('id') id: string) {
    return this.reservationsService.changeStatus(
      +id,
      ReservationStatut.TERMINEE,
    );
  }

  @Patch(':id/cancel')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
    PersonnelRole.COIFFEUR,
    PersonnelRole.ESTHETICIEN,
  )
  cancel(@Param('id') id: string) {
    return this.reservationsService.changeStatus(
      +id,
      ReservationStatut.ANNULEE,
    );
  }
}
