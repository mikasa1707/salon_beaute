import { Controller, Get, Query } from '@nestjs/common';

import { DashboardService } from './dashboard.service';
import { DashboardFilterDto } from './dto/dashboard-filter.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get()
  find(@Query() dto: DashboardFilterDto) {
    return this.service.getDashboard(dto);
  }
}
