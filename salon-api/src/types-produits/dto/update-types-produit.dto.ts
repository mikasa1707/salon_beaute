import { PartialType } from '@nestjs/swagger';
import { CreateTypeProduitDto } from './create-types-produit.dto';

export class UpdateTypesProduitDto extends PartialType(CreateTypeProduitDto) {}
