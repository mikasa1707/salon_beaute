import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

import { Vente } from 'src/ventes/entities/vente.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { Client } from 'src/clients/entities/client.entity';
import { ReservationPrestation } from 'src/reservations/entities/reservation-prestation.entity';
import { Personnel } from 'src/personnels/entities/personnel.entity';
import { ProduitUnite } from 'src/produits/entities/produit_unites.entity';
import { StockMovement } from 'src/stocks/entities/stock-movements.entity';
import { CashRegister } from 'src/cash-register/entities/cash_registers.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Vente,
      Reservation,
      Client,
      ReservationPrestation,
      Personnel,
      ProduitUnite,
      StockMovement,
      CashRegister,
    ]),
  ],

  controllers: [DashboardController],

  providers: [DashboardService],

  exports: [DashboardService],
})
export class DashboardModule {}
