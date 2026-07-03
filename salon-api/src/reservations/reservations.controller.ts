import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationStatut } from './entities/reservation.entity';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }

  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(+id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(+id);
  }

  @Patch(':id/status')
  changeStatus(
    @Param('id') id: string,
    @Body('status') status: ReservationStatut,
  ) {
    return this.reservationsService.changeStatus(+id, status);
  }

  @Patch(':id/confirm')
  confirm(@Param('id') id: string) {
    return this.reservationsService.changeStatus(
      +id,
      ReservationStatut.CONFIRMEE,
    );
  }

  @Patch(':id/start')
  start(@Param('id') id: string) {
    return this.reservationsService.changeStatus(
      +id,
      ReservationStatut.EN_COURS,
    );
  }

  @Patch(':id/finish')
  finish(@Param('id') id: string) {
    return this.reservationsService.changeStatus(
      +id,
      ReservationStatut.TERMINEE,
    );
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.reservationsService.changeStatus(
      +id,
      ReservationStatut.ANNULEE,
    );
  }
}
