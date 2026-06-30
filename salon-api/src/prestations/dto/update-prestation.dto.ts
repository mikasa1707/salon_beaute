import { PartialType } from '@nestjs/swagger';
import { CreatePrestationDto } from './create-prestation.dto';

export class UpdatePrestationDto extends PartialType(CreatePrestationDto) {}
