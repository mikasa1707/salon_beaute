import { Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CheckoutService } from './checkout.service';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}
  @Post(':factureId')
  checkout(
    @Param('factureId', ParseIntPipe)
    factureId: number,
  ) {
    return this.checkoutService.checkoutFacture(factureId);
  }
}
