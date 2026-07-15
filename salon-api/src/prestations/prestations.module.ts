import { Module } from '@nestjs/common';
import { PrestationsService } from './prestations.service';
import { PrestationsController } from './prestations.controller';
import { Prestation } from './entities/prestation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { TypePrestation } from 'src/types-prestations/entities/types-prestation.entity';
import { Personnel } from 'src/personnels/entities/personnel.entity';
import { PrestationRecette } from 'src/prestations-recettes/entities/prestations-recette.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Prestation,
      Reservation,
      TypePrestation,
      Personnel,
      PrestationRecette,
    ]),
  ],
  controllers: [PrestationsController],
  providers: [PrestationsService],
  exports: [PrestationsService],
})
export class PrestationsModule {}
