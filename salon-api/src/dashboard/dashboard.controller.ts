import { Controller, Get } from '@nestjs/common';

import { DashboardService } from './dashboard.service';
// import { DashboardFilterDto } from './dto/dashboard-filter.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get()
  find() {
    return this.service.getDashboard();
  }
}
