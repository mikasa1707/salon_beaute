import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { StockConsumptionController } from './stock-consumptions.controller';
import { StockConsumptionService } from './stock-consumptions.service';

import { StockConsumption } from './entities/stock-consumption.entity';
import { StockConsumptionItem } from './entities/stock-consumption-item.entity';

import { ProduitUnite } from 'src/produits/entities/produit_unites.entity';
import { StockMovement } from 'src/stocks/entities/stock-movements.entity';
import { AuditLogModule } from 'src/audit-log/audit-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockConsumption,
      StockConsumptionItem,
      ProduitUnite,
      StockMovement,
    ]),
    AuditLogModule,
  ],

  controllers: [StockConsumptionController],
  providers: [StockConsumptionService],
  exports: [StockConsumptionService],
})
export class StockConsumptionsModule {}
