import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PersonnelsService } from './personnels.service';
import { CreatePersonnelDto } from './dto/create-personnel.dto';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';

@Controller('personnels')
export class PersonnelsController {
  constructor(private readonly personnelsService: PersonnelsService) {}

  @Post()
  create(@Body() createPersonnelDto: CreatePersonnelDto) {
    return this.personnelsService.create(createPersonnelDto);
  }

  @Get()
  findAll() {
    return this.personnelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personnelsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonnelDto: UpdatePersonnelDto) {
    return this.personnelsService.update(+id, updatePersonnelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personnelsService.remove(+id);
  }
}
