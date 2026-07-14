import { Module } from '@nestjs/common';
import { PrestationsRecettesService } from './prestations-recettes.service';
import { PrestationsRecettesController } from './prestations-recettes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrestationRecette } from './entities/prestations-recette.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrestationRecette]),],
  controllers: [PrestationsRecettesController],
  providers: [PrestationsRecettesService],
  exports: [PrestationsRecettesService],
})
export class PrestationsRecettesModule { }
