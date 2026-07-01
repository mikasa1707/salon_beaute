import { Module } from '@nestjs/common';
import { InventairesService } from './inventaires.service';
import { InventairesController } from './inventaires.controller';
import { Inventaire } from './entities/inventaire.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Inventaire])],
  controllers: [InventairesController],
  providers: [InventairesService],
  exports: [InventairesService],
})
export class InventairesModule {}
