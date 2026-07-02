import { PartialType } from '@nestjs/mapped-types';
import { CreateVenteProduitDto } from './create-vente-produit.dto';

export class UpdateVenteProduitDto extends PartialType(CreateVenteProduitDto) {}
