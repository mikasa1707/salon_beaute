import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { CashRegisterService } from './cash-register.service';

import { Roles } from 'src/auth/decorators/roles.decorator';

import { RolesGuard } from 'src/auth/guards/roles.guard';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { UseGuards } from '@nestjs/common';

import { PersonnelRole } from 'src/personnels/entities/personnel.entity';

@Controller('cash-register')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CashRegisterController {
  constructor(private readonly service: CashRegisterService) {}

  @Post('open')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  open(
    @Body('openingBalance')
    openingBalance: number,
  ) {
    return this.service.openCashRegister(1, Number(openingBalance));
  }

  @Get('current')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  current() {
    return this.service.getOpenCashRegister(1);
  }

  @Get(':id/summary')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  summary(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.service.getSummary(id);
  }

  @Post('close/:id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  close(
    @Param('id', ParseIntPipe)
    id: number,

    @Body('countedBalance')
    countedBalance?: number,
  ) {
    return this.service.closeCashRegister(
      id,
      countedBalance !== undefined ? Number(countedBalance) : undefined,
    );
  }

  @Get('history')
  @Roles(PersonnelRole.ADMIN, PersonnelRole.RESPONSABLE)
  history() {
    return this.service.findAll(1);
  }
}
