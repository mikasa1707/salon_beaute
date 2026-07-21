import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ProduitUniteService } from './produit-unite.service';
import { CreateProduitUniteDto } from './dto/create-produit-unite.dto';
import { UpdateProduitUniteDto } from './dto/update-produit-unite.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PersonnelRole } from 'src/personnels/entities/personnel.entity';

@Controller('produit-unite')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProduitUniteController {
  constructor(private readonly produitsService: ProduitUniteService) {}

  @Post()
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  create(@Body() createProduitDto: CreateProduitUniteDto) {
    return this.produitsService.create(createProduitDto);
  }

  @Get('/unites')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
    PersonnelRole.COIFFEUR,
    PersonnelRole.ESTHETICIEN,
  )
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('typeProduitId') typeProduitId?: string,
  ) {
    return this.produitsService.getAll(
      page ? +page : 1,
      limit ? +limit : 10,
      search || '',
      typeProduitId || '',
    );
  }

  @Get(':id/unites')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
    PersonnelRole.COIFFEUR,
    PersonnelRole.ESTHETICIEN,
  )
  findAllUnites(
    @Param('id', ParseIntPipe) produitId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
  ) {
    return this.produitsService.findAll(produitId, page, limit, search);
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
    return this.produitsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  update(
    @Param('id') id: string,
    @Body() updateProduitDto: UpdateProduitUniteDto,
  ) {
    return this.produitsService.update(+id, updateProduitDto);
  }

  @Delete(':id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  remove(@Param('id') id: string) {
    return this.produitsService.remove(+id);
  }

  @Get('by-type/:typeProduitId')
  findAllByType(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('typeProduitId') typeProduitId?: number,
  ) {
    return this.produitsService.findAllByType(
      typeProduitId || 0,
      page ? +page : 1,
      limit ? +limit : 10,
      search || '',
    );
  }
}
