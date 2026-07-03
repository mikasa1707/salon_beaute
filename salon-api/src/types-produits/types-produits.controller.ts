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
import { TypesProduitsService } from './types-produits.service';
import { CreateTypeProduitDto } from './dto/create-types-produit.dto';
import { UpdateTypesProduitDto } from './dto/update-types-produit.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PersonnelRole } from 'src/personnels/entities/personnel.entity';

@Controller('types-produits')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TypesProduitsController {
  constructor(private readonly typesProduitsService: TypesProduitsService) {}

  @Post()
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  create(@Body() createTypesProduitDto: CreateTypeProduitDto) {
    return this.typesProduitsService.create(createTypesProduitDto);
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
    return this.typesProduitsService.findAll();
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
    return this.typesProduitsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  update(
    @Param('id') id: string,
    @Body() updateTypesProduitDto: UpdateTypesProduitDto,
  ) {
    return this.typesProduitsService.update(+id, updateTypesProduitDto);
  }

  @Delete(':id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  remove(@Param('id') id: string) {
    return this.typesProduitsService.remove(+id);
  }
}
