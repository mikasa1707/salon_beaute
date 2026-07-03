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
import { TypesPrestationsService } from './types-prestations.service';
import { CreateTypePrestationDto } from './dto/create-types-prestation.dto';
import { UpdateTypesPrestationDto } from './dto/update-types-prestation.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PersonnelRole } from 'src/personnels/entities/personnel.entity';

@Controller('types-prestations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TypesPrestationsController {
  constructor(
    private readonly typesPrestationsService: TypesPrestationsService,
  ) {}

  @Post()
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  create(@Body() createTypesPrestationDto: CreateTypePrestationDto) {
    return this.typesPrestationsService.create(createTypesPrestationDto);
  }

  @Get()
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
    PersonnelRole.COIFFEUR,
    PersonnelRole.ESTHETICIEN,
  )
  findAll() {
    return this.typesPrestationsService.findAll();
  }

  @Get(':id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
    PersonnelRole.COIFFEUR,
    PersonnelRole.ESTHETICIEN,
  )
  findOne(@Param('id') id: string) {
    return this.typesPrestationsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  update(
    @Param('id') id: string,
    @Body() updateTypesPrestationDto: UpdateTypesPrestationDto,
  ) {
    return this.typesPrestationsService.update(+id, updateTypesPrestationDto);
  }

  @Delete(':id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  remove(@Param('id') id: string) {
    return this.typesPrestationsService.remove(+id);
  }
}
