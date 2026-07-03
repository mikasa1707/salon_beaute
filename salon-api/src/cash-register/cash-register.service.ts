import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CashRegister } from './entities/cash_registers.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Vente } from '../ventes/entities/vente.entity';

@Injectable()
export class CashRegisterService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(CashRegister)
    private readonly repo: Repository<CashRegister>,
  ) {}

  async openCashRegister(salonId: number, openingBalance: number) {
    const open = await this.repo.findOne({
      where: {
        salonId,
        status: 'OPEN',
      },
    });

    if (open) {
      throw new ConflictException('Caisse déjà ouverte');
    }

    return this.repo.save({
      salonId,
      openedAt: new Date(),
      openingBalance,
      status: 'OPEN',
    });
  }

  async getOpenCashRegister(salonId: number) {
    return this.repo.findOne({
      where: {
        salonId,
        status: 'OPEN',
      },
    });
  }

  async closeCashRegister(cashRegisterId: number) {
    const qr = this.dataSource.createQueryRunner();

    await qr.connect();
    await qr.startTransaction();

    try {
      const cash = await qr.manager.findOne(CashRegister, {
        where: { id: cashRegisterId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!cash) throw new NotFoundException();

      if (cash.status === 'CLOSED') {
        throw new ConflictException('Déjà fermé');
      }

      // recalcul total réel depuis ventes
      const ventes = await qr.manager.find(Vente, {
        where: {
          cashRegister: { id: cash.id },
        },
      });

      let total = 0;

      for (const v of ventes) {
        total += Number(v.total);
      }

      cash.closingBalance = cash.openingBalance + total;
      cash.status = 'CLOSED';
      cash.closedAt = new Date();

      await qr.manager.save(cash);

      await qr.commitTransaction();

      return cash;
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }
}
