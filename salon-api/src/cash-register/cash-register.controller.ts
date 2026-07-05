import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CashRegisterService } from './cash-register.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PersonnelRole } from 'src/personnels/entities/personnel.entity';

@Controller('cash-register')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CashRegisterController {
  constructor(private readonly cashRegisterService: CashRegisterService) {}

  // =========================
  // OUVRIR LA CAISSE
  // =========================
  @Post('open')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  open(@Body('openingBalance') openingBalance: number) {
    // V2 : un seul salon
    return this.cashRegisterService.openCashRegister(1, Number(openingBalance));
  }

  // =========================
  // CAISSE OUVERTE
  // =========================
  @Get('current')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  current() {
    // V2 : un seul salon
    return this.cashRegisterService.getOpenCashRegister(1);
  }

  // =========================
  // FERMER LA CAISSE
  // =========================
  @Post('close/:id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
  )
  close(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.cashRegisterService.closeCashRegister(id);
  }
}
