import { Module } from '@nestjs/common';
import { TypesPrestationsService } from './types-prestations.service';
import { TypesPrestationsController } from './types-prestations.controller';
import { TypePrestation } from './entities/types-prestation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestation } from 'src/prestations/entities/prestation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TypePrestation, Prestation])],
  controllers: [TypesPrestationsController],
  providers: [TypesPrestationsService],
  exports: [TypesPrestationsService],
})
export class TypesPrestationsModule {}
