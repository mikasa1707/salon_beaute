import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PrestationsService } from './prestations.service';
import { CreatePrestationDto } from './dto/create-prestation.dto';
import { UpdatePrestationDto } from './dto/update-prestation.dto';

@Controller('prestations')
export class PrestationsController {
  constructor(private readonly prestationsService: PrestationsService) {}

  @Post()
  create(@Body() createPrestationDto: CreatePrestationDto) {
    return this.prestationsService.create(createPrestationDto);
  }

  @Get()
  findAll() {
    return this.prestationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prestationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePrestationDto: UpdatePrestationDto) {
    return this.prestationsService.update(+id, updatePrestationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prestationsService.remove(+id);
  }
}
