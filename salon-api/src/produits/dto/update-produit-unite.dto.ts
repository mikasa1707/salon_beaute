import { PartialType } from '@nestjs/mapped-types';
import { CreateProduitUniteDto } from './create-produit-unite.dto';

export class UpdateProduitUniteDto extends PartialType(CreateProduitUniteDto) {}
