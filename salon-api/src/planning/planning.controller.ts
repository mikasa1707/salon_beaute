import { Controller, Get, Param, Query } from '@nestjs/common';
import { PlanningService } from './planning.service';

@Controller('planning')
export class PlanningController {
  constructor(private readonly service: PlanningService) {}

  // 📅 agenda du jour
  @Get('agenda/:id')
  getAgenda(@Param('id') id: string, @Query('date') date: string) {
    return this.service.getAgenda(+id, new Date(date));
  }

  // 🟢 slots libres
  @Get('slots/:id')
  getSlots(
    @Param('id') id: string,
    @Query('date') date: string,
    @Query('duration') duration: string,
  ) {
    return this.service.getAvailableSlots(+id, new Date(date), +duration);
  }
}
