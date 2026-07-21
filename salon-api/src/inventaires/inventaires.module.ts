import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Inventaire } from './entities/inventaire.entity';
import { InventaireLigne } from './entities/inventaire.entity';

import { InventairesService } from './inventaires.service';
import { InventairesController } from './inventaires.controller';

import { ProduitUnite } from '../produits/entities/produit_unites.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventaire, InventaireLigne, ProduitUnite]),
  ],
  controllers: [InventairesController],
  providers: [InventairesService],
  exports: [InventairesService],
})
export class InventairesModule {}
