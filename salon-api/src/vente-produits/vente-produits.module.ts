import { Module } from '@nestjs/common';
import { VenteProduitsController } from './vente-produits.controller';
import { VenteProduitsService } from './vente-produits.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { Vente } from 'src/ventes/entities/vente.entity';
import { VenteProduit } from './entities/vente-produit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vente, Reservation, VenteProduit])],
  controllers: [VenteProduitsController],
  providers: [VenteProduitsService],
  exports: [VenteProduitsService],
})
export class VenteProduitsModule {}
