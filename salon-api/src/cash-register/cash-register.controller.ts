import { Controller, UseGuards, Post, Param, ParseIntPipe, Body, Get } from "@nestjs/common";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CashRegisterService } from "src/cash-register/cash-register.service";

@Controller('cash-register')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CashRegisterController {
  constructor(private readonly service: CashRegisterService) {}

  @Post('create')
  create() {
    return this.service.createSession(1);
  }

  @Post('open/:id')
  open(
    @Param('id', ParseIntPipe) id: number,

    @Body('openingBalance') balance: number,
  ) {
    return this.service.openCashRegister(id, Number(balance));
  }

  @Get('current')
  current() {
    return this.service.getOpenCashRegister(1);
  }

  @Get(':id/summary')
  summary(@Param('id', ParseIntPipe) id: number) {
    return this.service.getSummary(id);
  }

  @Post('close/:id')
  close(
    @Param('id', ParseIntPipe) id: number,

    @Body('countedBalance') balance: number,
  ) {
    return this.service.closeCashRegister(id, Number(balance));
  }

  @Get('history')
  history() {
    return this.service.findAll(1);
  }
}
