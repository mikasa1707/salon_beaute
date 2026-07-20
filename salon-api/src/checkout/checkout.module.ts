import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facturation } from 'src/facturations/entities/facturation.entity';
import { ProduitUnite } from 'src/produits/entities/produit_unites.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { VenteProduit } from 'src/vente-produits/entities/vente-produit.entity';
import { Vente } from 'src/ventes/entities/vente.entity';
import { AuditLogModule } from 'src/audit-log/audit-log.module';
import { StockMovement } from 'src/stocks/entities/stock-movements.entity';
import { StockConsumptionModule } from 'src/stocks/stock-consumption.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Facturation,
      Vente,
      VenteProduit,
      ProduitUnite,
      Reservation,
      StockMovement,
    ]),
    AuditLogModule,
    StockConsumptionModule,
  ],
  controllers: [CheckoutController],
  providers: [CheckoutService],
  exports: [CheckoutService],
})
export class CheckoutModule {}
