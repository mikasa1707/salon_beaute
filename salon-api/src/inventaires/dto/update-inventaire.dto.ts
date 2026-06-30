import { PartialType } from '@nestjs/swagger';
import { CreateInventaireDto } from './create-inventaire.dto';

export class UpdateInventaireDto extends PartialType(CreateInventaireDto) {}
