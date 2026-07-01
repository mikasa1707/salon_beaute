import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MarquesService } from './marques.service';
import { CreateMarqueDto } from './dto/create-marque.dto';
import { UpdateMarqueDto } from './dto/update-marque.dto';

@Controller('marques')
export class MarquesController {
  constructor(private readonly marquesService: MarquesService) {}

  @Post()
  create(@Body() createMarqueDto: CreateMarqueDto) {
    return this.marquesService.create(createMarqueDto);
  }

  @Get()
  findAll() {
    return this.marquesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marquesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarqueDto: UpdateMarqueDto) {
    return this.marquesService.update(+id, updateMarqueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marquesService.remove(+id);
  }
}
