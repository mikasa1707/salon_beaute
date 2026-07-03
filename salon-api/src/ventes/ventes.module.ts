import { Module } from '@nestjs/common';
import { VentesController } from './ventes.controller';
import { VentesService } from './ventes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vente } from './entities/vente.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { VenteProduit } from 'src/vente-produits/entities/vente-produit.entity';
import { Paiement } from 'src/paiements/entities/paiement.entity';
import { Facturation } from 'src/facturations/entities/facturation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Vente,
      Reservation,
      VenteProduit,
      Paiement,
      Facturation,
    ]),
  ],
  controllers: [VentesController],
  providers: [VentesService],
  exports: [VentesService],
})
export class VentesModule {}
