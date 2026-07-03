import { Module } from '@nestjs/common';
import { FacturationsService } from './facturations.service';
import { FacturationsController } from './facturations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facturation } from './entities/facturation.entity';
import { FacturationItem } from './entities/facturation-item.entity';
import { ProduitUnite } from 'src/produits/entities/produit_unites.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Facturation, FacturationItem, ProduitUnite]),
  ],
  providers: [FacturationsService],
  controllers: [FacturationsController],
  exports: [FacturationsService],
})
export class FacturationsModule {}
