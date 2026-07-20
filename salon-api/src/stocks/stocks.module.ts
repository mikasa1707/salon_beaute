import { Module } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { Produit } from 'src/produits/entities/produit.entity';
import { StockMovement } from './entities/stock-movements.entity';
import { PrestationProduit } from 'src/prestations_produits/entities/prestations-produits.entity';
import { ProduitUnite } from 'src/produits/entities/produit_unites.entity';
import { StockConsumptionModule } from './stock-consumption.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Stock,
      Produit,
      StockMovement,
      ProduitUnite,
      PrestationProduit,
    ]),
    StockConsumptionModule
  ],
  controllers: [StocksController],
  providers: [StocksService],
  exports: [StocksService],
})
export class StocksModule {}
