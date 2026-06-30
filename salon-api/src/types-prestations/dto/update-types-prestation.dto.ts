import { PartialType } from '@nestjs/swagger';
import { CreateTypesPrestationDto } from './create-types-prestation.dto';

export class UpdateTypesPrestationDto extends PartialType(CreateTypesPrestationDto) {}
