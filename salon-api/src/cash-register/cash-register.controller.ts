import {
  Controller,
  UseGuards,
  Post,
  Param,
  ParseIntPipe,
  Body,
  Get,
  Query,
} from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CashRegisterService } from 'src/cash-register/cash-register.service';

@Controller('cash-register')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CashRegisterController {
  constructor(private readonly service: CashRegisterService) {}

  @Post('create')
  create() {
    return this.service.createSession(1);
  }

  @Post('open/:id')
  open(@Param('id', ParseIntPipe) id: number) {
    return this.service.openCashRegister(id);
  }

  @Get('current')
  current() {
    return this.service.getCurrentCashRegister(1);
  }

  @Post('close/:id')
  close(
    @Param('id', ParseIntPipe) id: number,

    @Body('countedBalance') balance: number,
  ) {
    return this.service.closeCashRegister(id, Number(balance));
  }

  @Get('history')
  findAll(
    @Query('salonId') salonId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.service.findAll(1, Number(page), Number(limit));
  }

  @Get(':id/summary')
  summary(@Param('id', ParseIntPipe) id: number) {
    return this.service.getSummary(id);
  }

  @Get(':id/detail')
  detail(@Param('id', ParseIntPipe) id: number) {
    return this.service.getHistoryDetail(id);
  }
}
