import { Module } from '@nestjs/common';
import { TypesPrestationsService } from './types-prestations.service';
import { TypesPrestationsController } from './types-prestations.controller';

@Module({
  controllers: [TypesPrestationsController],
  providers: [TypesPrestationsService],
})
export class TypesPrestationsModule {}
