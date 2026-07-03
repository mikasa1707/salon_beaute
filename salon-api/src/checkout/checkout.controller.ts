import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Body,
} from '@nestjs/common';

import { CheckoutService } from './checkout.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PersonnelRole } from '../personnels/entities/personnel.entity';

@Controller('checkout')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  // =========================
  // 💰 CHECKOUT FACTURE
  // =========================
  @Post(':factureId')
  @Roles(PersonnelRole.RECEPTION, PersonnelRole.ADMIN)
  checkout(
    @Param('factureId', ParseIntPipe)
    factureId: number,
  ) {
    return this.checkoutService.checkoutFacture(factureId);
  }

  // =========================
  // ❌ CANCEL VENTE
  // =========================
  @Post('cancel/:venteId')
  @Roles(PersonnelRole.RESPONSABLE, PersonnelRole.ADMIN)
  cancelVente(
    @Param('venteId', ParseIntPipe)
    venteId: number,
  ) {
    return this.checkoutService.cancelVente(venteId);
  }
}
