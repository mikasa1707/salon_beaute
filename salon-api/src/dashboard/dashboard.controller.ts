import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get()
  getDashboard(@Query('date') date: string) {
    return this.service.getDashboard(new Date(date));
  }

  @Get('revenue')
  revenue(@Query('date') date: string) {
    return this.service.getDailyRevenue(new Date(date));
  }

  @Get('staff')
  staff(@Query('date') date: string) {
    return this.service.getStaffPerformance(new Date(date));
  }

  @Get('top')
  top(@Query('date') date: string) {
    return this.service.getTopPrestations(new Date(date));
  }

  @Get('stockalert')
  stockalert() {
    return this.service.getStockAlerts();
  }

  @Get('stock')
  stock() {
    return this.service.getDashboardStock();
  }
}
