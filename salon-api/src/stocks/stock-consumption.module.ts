import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StockConsumptionService } from './stock-consumption.service';
import { StockMovement } from './entities/stock-movements.entity';
import { ProduitUnite } from 'src/produits/entities/produit_unites.entity';
import { AuditLogModule } from 'src/audit-log/audit-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([StockMovement, ProduitUnite]), AuditLogModule],
  providers: [StockConsumptionService],
  exports: [StockConsumptionService],
})
export class StockConsumptionModule {}
