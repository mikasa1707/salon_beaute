import { Module } from '@nestjs/common';
import { PaiementsController } from './paiements.controller';
import { PaiementsService } from './paiements.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vente } from 'src/ventes/entities/vente.entity';
import { Paiement } from './entities/paiement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vente, Paiement])],
  controllers: [PaiementsController],
  providers: [PaiementsService],
  exports: [PaiementsService],
})
export class PaiementsModule {}
