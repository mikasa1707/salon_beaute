import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PersonnelRole } from 'src/personnels/entities/personnel.entity';

import { CashMovementService } from './cash-movements.service';
import { CreateCashMovementDto } from './dto/create-cash-movement.dto';

@Controller('cash-movements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CashMovementController {
  constructor(private readonly service: CashMovementService) {}

  /**
   * Ajouter un mouvement
   * Décaissement / entrée
   */
  @Post(':cashRegisterId')
  @Roles(
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
    PersonnelRole.RECEPTION,
  )
  create(
    @Param('cashRegisterId', ParseIntPipe)
    cashRegisterId: number,

    @Body()
    dto: CreateCashMovementDto,
  ) {
    return this.service.create(cashRegisterId, dto);
  }

  /**
   * Liste mouvements d'une caisse
   * Pagination + recherche
   */
  @Get(':cashRegisterId')
  @Roles(
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
    PersonnelRole.RECEPTION,
  )
  findByCashRegister(
    @Param('cashRegisterId', ParseIntPipe)
    cashRegisterId: number,

    @Query('page')
    page?: string,

    @Query('limit')
    limit?: string,

    @Query('search')
    search?: string,
  ) {
    return this.service.findByCashRegister(
      cashRegisterId,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
      search ?? '',
    );
  }

  /**
   * Liste mouvements de la caisse actuellement ouverte
   */
  @Get('current/list')
  @Roles(
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
    PersonnelRole.RECEPTION,
  )
  findCurrent(
    @Query('page')
    page?: string,

    @Query('limit')
    limit?: string,

    @Query('search')
    search?: string,
  ) {
    return this.service.findCurrent(
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
      search ?? '',
    );
  }
}
