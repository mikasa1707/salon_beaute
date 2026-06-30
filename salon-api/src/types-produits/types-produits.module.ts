import { Module } from '@nestjs/common';
import { TypesProduitsService } from './types-produits.service';
import { TypesProduitsController } from './types-produits.controller';

@Module({
  controllers: [TypesProduitsController],
  providers: [TypesProduitsService],
})
export class TypesProduitsModule {}
