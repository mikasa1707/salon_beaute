import { Module } from '@nestjs/common';
import { CashRegisterService } from './cash-register.service';
import { CashRegisterController } from './cash-register.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { CashRegister } from './entities/cash_registers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CashRegister])],
  providers: [CashRegisterService],
  controllers: [CashRegisterController],
  exports: [CashRegisterService],
})
export class CashRegisterModule {}
