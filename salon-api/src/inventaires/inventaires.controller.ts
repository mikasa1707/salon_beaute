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
import { InventairesService } from './inventaires.service';
import { CreateInventaireDto } from './dto/create-inventaire.dto';
import { UpdateInventaireDto } from './dto/update-inventaire.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PersonnelRole } from 'src/personnels/entities/personnel.entity';

@Controller('inventaires')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventairesController {
  constructor(private readonly inventairesService: InventairesService) {}

  @Post()
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  create(@Body() createInventaireDto: CreateInventaireDto) {
    return this.inventairesService.create(createInventaireDto);
  }

  @Get()
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  findAll() {
    return this.inventairesService.findAll();
  }

  @Get(':id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  findOne(@Param('id') id: string) {
    return this.inventairesService.findOne(+id);
  }

  @Patch(':id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  update(
    @Param('id') id: string,
    @Body() updateInventaireDto: UpdateInventaireDto,
  ) {
    return this.inventairesService.update(+id, updateInventaireDto);
  }

  @Delete(':id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  remove(@Param('id') id: string) {
    return this.inventairesService.remove(+id);
  }
}
