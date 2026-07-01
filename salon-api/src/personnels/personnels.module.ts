import { Module } from '@nestjs/common';
import { PersonnelsService } from './personnels.service';
import { PersonnelsController } from './personnels.controller';
import { Personnel } from './entities/personnel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from 'src/reservations/entities/reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Personnel, Reservation])],
  controllers: [PersonnelsController],
  providers: [PersonnelsService],
  exports: [PersonnelsService],
})
export class PersonnelsModule {}
