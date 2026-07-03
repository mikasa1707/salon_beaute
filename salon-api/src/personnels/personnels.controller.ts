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
import { PersonnelsService } from './personnels.service';
import { CreatePersonnelDto } from './dto/create-personnel.dto';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PersonnelRole } from './entities/personnel.entity';

@Controller('personnels')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PersonnelsController {
  constructor(private readonly personnelsService: PersonnelsService) {}

  @Post()
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  create(@Body() createPersonnelDto: CreatePersonnelDto) {
    return this.personnelsService.create(createPersonnelDto);
  }

  @Get()
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  findAll() {
    return this.personnelsService.findAll();
  }

  @Get(':id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  findOne(@Param('id') id: string) {
    return this.personnelsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  update(
    @Param('id') id: string,
    @Body() updatePersonnelDto: UpdatePersonnelDto,
  ) {
    return this.personnelsService.update(+id, updatePersonnelDto);
  }

  @Delete(':id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  remove(@Param('id') id: string) {
    return this.personnelsService.remove(+id);
  }
}
