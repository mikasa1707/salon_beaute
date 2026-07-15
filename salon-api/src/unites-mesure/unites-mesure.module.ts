import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UniteMesure } from './entities/unites-mesure.entity';
import { UnitesMesureService } from './unites-mesure.service';
import { UnitesMesureController } from './unites-mesure.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UniteMesure])],
  controllers: [UnitesMesureController],
  providers: [UnitesMesureService],
  exports: [UnitesMesureService],
})
export class UnitesMesureModule {}
