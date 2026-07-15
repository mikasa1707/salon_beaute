import { Module } from '@nestjs/common';
import { ProduitsService } from './produits.service';
import { ProduitsController } from './produits.controller';
import { ProduitUniteController } from './produit-unite.controller';
import { Produit } from './entities/produit.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeProduit } from 'src/types-produits/entities/types-produit.entity';
import { Stock } from 'src/stocks/entities/stock.entity';
import { Marque } from 'src/marques/entities/marque.entity';
import { ProduitUnite } from './entities/produit_unites.entity';
import { ProduitUniteService } from './produit-unite.service';
import { PrestationRecette } from 'src/prestations-recettes/entities/prestations-recette.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Produit,
      TypeProduit,
      Stock,
      Marque,
      ProduitUnite,
      PrestationRecette,
    ]),
  ],
  controllers: [ProduitsController, ProduitUniteController],
  providers: [ProduitsService, ProduitUniteService],
  exports: [ProduitsService, ProduitUniteService],
})
export class ProduitsModule {}
