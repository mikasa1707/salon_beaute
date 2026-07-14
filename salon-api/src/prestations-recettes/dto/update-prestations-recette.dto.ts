import { PartialType } from '@nestjs/swagger';
import { CreatePrestationRecetteDto } from './create-prestations-recette.dto';

export class UpdatePrestationsRecetteDto extends PartialType(CreatePrestationRecetteDto) {}
