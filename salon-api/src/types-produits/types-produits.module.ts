import { Module } from '@nestjs/common';
import { TypesProduitsService } from './types-produits.service';
import { TypesProduitsController } from './types-produits.controller';
import { TypeProduit } from './entities/types-produit.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produit } from 'src/produits/entities/produit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TypeProduit, Produit])],
  controllers: [TypesProduitsController],
  providers: [TypesProduitsService],
  exports: [TypesProduitsService],
})
export class TypesProduitsModule {}
