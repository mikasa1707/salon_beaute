import { PartialType } from '@nestjs/mapped-types';
import { CreateFacturationDto } from './create-facturation.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateFacturationDto extends PartialType(CreateFacturationDto) {
  @IsOptional()
  @IsEnum(['UNPAID', 'PARTIAL', 'PAID', 'CANCELLED'])
  statut?: string;
}
