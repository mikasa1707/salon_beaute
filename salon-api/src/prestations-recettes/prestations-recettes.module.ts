import { Module } from '@nestjs/common';
import { PrestationsRecettesService } from './prestations-recettes.service';
import { PrestationsRecettesController } from './prestations-recettes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrestationRecette } from './entities/prestations-recette.entity';
import { Produit } from 'src/produits/entities/produit.entity';
import { Prestation } from 'src/prestations/entities/prestation.entity';
import { UniteMesure } from 'src/unites-mesure/entities/unites-mesure.entity';
import { PrestationProduit } from 'src/prestations_produits/entities/prestations-produits.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PrestationRecette,
      Produit,
      Prestation,
      UniteMesure,
      PrestationProduit,
    ]),
  ],
  controllers: [PrestationsRecettesController],
  providers: [PrestationsRecettesService],
  exports: [PrestationsRecettesService],
})
export class PrestationsRecettesModule {}
