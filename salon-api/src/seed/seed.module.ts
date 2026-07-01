import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SeedService } from './seed.service';
import { Personnel } from '../personnels/entities/personnel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Personnel])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
