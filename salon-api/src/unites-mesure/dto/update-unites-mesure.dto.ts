import { PartialType } from '@nestjs/swagger';
import { CreateUniteMesureDto } from './create-unites-mesure.dto';

export class UpdateUnitesMesureDto extends PartialType(CreateUniteMesureDto) {}
