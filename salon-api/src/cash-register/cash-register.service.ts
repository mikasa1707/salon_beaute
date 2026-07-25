import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CashRegister } from './entities/cash_registers.entity';
import { Vente } from '../ventes/entities/vente.entity';

@Injectable()
export class CashRegisterService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(CashRegister)
    private readonly repo: Repository<CashRegister>,
  ) {}

  /**
   * OUVERTURE CAISSE
   */
  async openCashRegister(salonId: number, openingBalance: number) {
    const open = await this.repo.findOne({
      where: {
        salonId,
        status: 'OPEN',
      },
    });

    if (open) {
      throw new ConflictException('Une caisse est déjà ouverte');
    }

    return this.repo.save({
      salonId,

      openingBalance,

      totalCash: 0,

      totalCard: 0,

      totalMobileMoney: 0,

      cashout: 0,

      closingBalance: 0,

      status: 'OPEN',

      openedAt: new Date(),
    });
  }

  /**
   * CAISSE ACTIVE
   */
  async getOpenCashRegister(salonId: number) {
    return this.repo.findOne({
      where: {
        salonId,
        status: 'OPEN',
      },
    });
  }

  /**
   * DETAIL CAISSE
   */
  async getSummary(cashRegisterId: number) {
    const cash = await this.repo.findOne({
      where: {
        id: cashRegisterId,
      },
    });

    if (!cash) {
      throw new NotFoundException('Caisse introuvable');
    }

    return {
      ...cash,

      soldeTheorique:
        Number(cash.openingBalance) +
        Number(cash.totalCash) -
        Number(cash.cashout),

      totalEncaissement:
        Number(cash.totalCash) +
        Number(cash.totalCard) +
        Number(cash.totalMobileMoney),
    };
  }

  /**
   * UTILISE PAR CHECKOUT
   */
  updatePayment(
    cashRegister: CashRegister,
    modePaiement: string,
    montant: number,
  ) {
    switch (modePaiement) {
      case 'ESPECE':
      case 'CASH':
        cashRegister.totalCash = Number(cashRegister.totalCash) + montant;

        break;

      case 'CARTE':
        cashRegister.totalCard = Number(cashRegister.totalCard) + montant;

        break;

      case 'MOBILE':
      case 'MOBILE_MONEY':
        cashRegister.totalMobileMoney =
          Number(cashRegister.totalMobileMoney) + montant;

        break;

      default:
        throw new ConflictException(`Mode paiement inconnu ${modePaiement}`);
    }

    return cashRegister;
  }

  /**
   * FERMETURE CAISSE
   */
  async closeCashRegister(cashRegisterId: number, countedBalance?: number) {
    const qr = this.dataSource.createQueryRunner();

    await qr.connect();

    await qr.startTransaction();

    try {
      const cash = await qr.manager.findOne(CashRegister, {
        where: {
          id: cashRegisterId,
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!cash) {
        throw new NotFoundException('Caisse introuvable');
      }

      if (cash.status === 'CLOSED') {
        throw new ConflictException('Caisse déjà fermée');
      }

      const theorique =
        Number(cash.openingBalance) +
        Number(cash.totalCash) -
        Number(cash.cashout);

      cash.closingBalance = countedBalance ?? theorique;

      cash.status = 'CLOSED';

      cash.closedAt = new Date();

      await qr.manager.save(CashRegister, cash);

      await qr.commitTransaction();

      return {
        cash,

        theorique,

        ecart:
          countedBalance !== undefined ? Number(countedBalance) - theorique : 0,
      };
    } catch (error) {
      await qr.rollbackTransaction();

      throw error;
    } finally {
      await qr.release();
    }
  }

  /**
   * HISTORIQUE
   */
  async findAll(salonId: number) {
    return this.repo.find({
      where: {
        salonId,
      },

      order: {
        openedAt: 'DESC',
      },
    });
  }
}
