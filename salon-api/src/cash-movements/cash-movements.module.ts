import { Module } from '@nestjs/common';
import { CashMovementService } from './cash-movements.service';
import { CashMovementController } from './cash-movements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashMovement } from './entities/cash-movement.entity';
import { CashRegister } from 'src/cash-register/entities/cash_registers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CashMovement, CashRegister])],
  controllers: [CashMovementController],
  providers: [CashMovementService],
  exports: [CashMovementService],
})
export class CashMovementModule {}
