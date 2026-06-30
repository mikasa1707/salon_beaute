import { Module } from '@nestjs/common';
import { MarquesService } from './marques.service';
import { MarquesController } from './marques.controller';

@Module({
  controllers: [MarquesController],
  providers: [MarquesService],
})
export class MarquesModule {}
