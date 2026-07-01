import { Module } from '@nestjs/common';
import { MarquesService } from './marques.service';
import { MarquesController } from './marques.controller';
import { Marque } from './entities/marque.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produit } from 'src/produits/entities/produit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Marque, Produit])],
  controllers: [MarquesController],
  providers: [MarquesService],
  exports: [MarquesService],
})
export class MarquesModule {}
