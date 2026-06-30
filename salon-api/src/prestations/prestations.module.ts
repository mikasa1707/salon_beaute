import { Module } from '@nestjs/common';
import { PrestationsService } from './prestations.service';
import { PrestationsController } from './prestations.controller';

@Module({
  controllers: [PrestationsController],
  providers: [PrestationsService],
})
export class PrestationsModule {}
