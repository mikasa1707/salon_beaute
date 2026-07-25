import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import {
  CashMovement,
  CashMovementDirection,
} from './entities/cash-movement.entity';

import { CashRegister } from '../cash-register/entities/cash_registers.entity';
import { CreateCashMovementDto } from './dto/create-cash-movement.dto';

@Injectable()
export class CashMovementService {
  constructor(
    @InjectRepository(CashMovement)
    private readonly repo: Repository<CashMovement>,

    @InjectRepository(CashRegister)
    private readonly cashRepo: Repository<CashRegister>,
  ) {}

  async create(cashRegisterId: number, dto: CreateCashMovementDto) {
    const cash = await this.cashRepo.findOne({
      where: {
        id: cashRegisterId,
      },
    });

    if (!cash) {
      throw new NotFoundException('Caisse introuvable');
    }

    if (cash.status === 'CLOSED') {
      throw new ConflictException('Caisse fermée');
    }

    const movement = this.repo.create({
      cashRegister: cash,
      ...dto,
    });

    const saved = await this.repo.save(movement);

    if (dto.direction === CashMovementDirection.IN) {
      cash.totalCash = Number(cash.totalCash) + Number(dto.amount);
    }

    if (dto.direction === CashMovementDirection.OUT) {
      cash.totalCash = Number(cash.totalCash) - Number(dto.amount);

      cash.cashout = Number(cash.cashout) + Number(dto.amount);
    }

    await this.cashRepo.save(cash);

    return saved;
  }

  async findByCashRegister(id: number) {
    return this.repo.find({
      where: {
        cashRegister: {
          id,
        },
      },

      order: {
        createdAt: 'DESC',
      },
    });
  }
}
