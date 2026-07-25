import {
  Controller,
  UseGuards,
  Post,
  Param,
  ParseIntPipe,
  Body,
  Get,
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

  @Get(':cashRegisterId')
  findAll(
    @Param('cashRegisterId', ParseIntPipe)
    id: number,
  ) {
    return this.service.findByCashRegister(id);
  }
}
