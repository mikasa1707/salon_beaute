import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Personnel } from 'src/personnels/entities/personnel.entity';
import { Produit } from 'src/produits/entities/produit.entity';
import { ProduitUnite } from 'src/produits/entities/produit_unites.entity';
import { Vente } from 'src/ventes/entities/vente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facturation } from 'src/facturations/entities/facturation.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reservation,
      Personnel,
      Produit,
      ProduitUnite,
      Facturation,
      Vente,
    ]),
  ],
  providers: [DashboardService],
  controllers: [DashboardController],
  exports: [DashboardService],
})
export class DashboardModule {}
