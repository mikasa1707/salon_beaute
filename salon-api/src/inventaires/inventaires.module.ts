import { Module } from '@nestjs/common';
import { InventairesService } from './inventaires.service';
import { InventairesController } from './inventaires.controller';

@Module({
  controllers: [InventairesController],
  providers: [InventairesService],
})
export class InventairesModule {}
