import { PartialType } from '@nestjs/swagger';
import { CreateMarqueDto } from './create-marque.dto';

export class UpdateMarqueDto extends PartialType(CreateMarqueDto) {}
