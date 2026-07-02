import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './entities/reservation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationPrestation } from './entities/reservation-prestation.entity';
import { Prestation } from 'src/prestations/entities/prestation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, ReservationPrestation, Prestation]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
