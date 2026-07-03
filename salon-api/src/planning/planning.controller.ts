import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PlanningService } from './planning.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PersonnelRole } from 'src/personnels/entities/personnel.entity';

@Controller('planning')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlanningController {
  constructor(private readonly service: PlanningService) {}

  // 📅 agenda du jour
  @Get('agenda/:id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
    PersonnelRole.COIFFEUR,
    PersonnelRole.ESTHETICIEN,
  )
  getAgenda(@Param('id') id: string, @Query('date') date: string) {
    return this.service.getAgenda(+id, new Date(date));
  }

  // 🟢 slots libres
  @Get('slots/:id')
  @Roles(
    PersonnelRole.RECEPTION,
    PersonnelRole.ADMIN,
    PersonnelRole.RESPONSABLE,
    PersonnelRole.COIFFEUR,
    PersonnelRole.ESTHETICIEN,
  )
  getSlots(
    @Param('id') id: string,
    @Query('date') date: string,
    @Query('duration') duration: string,
  ) {
    return this.service.getAvailableSlots(+id, new Date(date), +duration);
  }
}
