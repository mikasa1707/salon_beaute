import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './entities/reservation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationPrestation } from './entities/reservation-prestation.entity';
import { Prestation } from 'src/prestations/entities/prestation.entity';
import { Facturation } from 'src/facturations/entities/facturation.entity';
import { FacturationItem } from 'src/facturations/entities/facturation-item.entity';
import { FacturationsService } from 'src/facturations/facturations.service';
import { ReservationPersonnel } from './entities/reservation-personnel.entity';
import { StockConsumptionService } from 'src/stocks/stock-consumption.service';
import { PrestationProduit } from 'src/prestations_produits/entities/prestations-produits.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reservation,
      ReservationPrestation,
      Prestation,
      Facturation,
      FacturationItem,
      ReservationPersonnel,
      PrestationProduit,
    ]),
  ],
  controllers: [ReservationsController],
  providers: [
    ReservationsService,
    FacturationsService,
    StockConsumptionService,
  ],
  exports: [ReservationsService],
})
export class ReservationsModule {}
