import { PartialType } from '@nestjs/swagger';
import { CreateTypePrestationDto } from './create-types-prestation.dto';

export class UpdateTypesPrestationDto extends PartialType(
  CreateTypePrestationDto,
) {}
