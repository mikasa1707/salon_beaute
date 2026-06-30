import { PartialType } from '@nestjs/swagger';
import { CreateTypesProduitDto } from './create-types-produit.dto';

export class UpdateTypesProduitDto extends PartialType(CreateTypesProduitDto) {}
