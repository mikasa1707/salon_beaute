import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrestationProduit } from './entities/prestations-produits.entity';
import { Produit } from 'src/produits/entities/produit.entity';
import { ProduitUnite } from 'src/produits/entities/produit_unites.entity';
import { Prestation } from 'src/prestations/entities/prestation.entity';
import { PrestationProduitsController } from './prestations-produits.controller';
import { PrestationProduitsService } from './prestations_produits.service';
import { PrestationRecette } from 'src/prestations-recettes/entities/prestations-recette.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PrestationProduit,
      Produit,
      ProduitUnite,
      Prestation, 
      PrestationRecette
    ]),
  ],
  controllers: [PrestationProduitsController],
  providers: [PrestationProduitsService],
  exports: [PrestationProduitsService],
})
export class PrestationProduitsModule { }
