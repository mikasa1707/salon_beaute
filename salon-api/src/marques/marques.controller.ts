import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MarquesService } from './marques.service';
import { CreateMarqueDto } from './dto/create-marque.dto';
import { UpdateMarqueDto } from './dto/update-marque.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PersonnelRole } from 'src/personnels/entities/personnel.entity';

@Controller('marques')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MarquesController {
  constructor(private readonly marquesService: MarquesService) {}

  @Post()
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  create(@Body() createMarqueDto: CreateMarqueDto) {
    return this.marquesService.create(createMarqueDto);
  }

  @Get()
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  findAll() {
    return this.marquesService.findAll();
  }

  @Get(':id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  findOne(@Param('id') id: string) {
    return this.marquesService.findOne(+id);
  }

  @Patch(':id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  update(@Param('id') id: string, @Body() updateMarqueDto: UpdateMarqueDto) {
    return this.marquesService.update(+id, updateMarqueDto);
  }

  @Delete(':id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  remove(@Param('id') id: string) {
    return this.marquesService.remove(+id);
  }
}
