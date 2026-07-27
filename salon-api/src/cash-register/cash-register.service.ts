import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import {
  CashMovement,
  CashMovementType,
  CashMovementDirection,
} from 'src/cash-movements/entities/cash-movement.entity';

import { DataSource, Repository } from 'typeorm';

import { CashRegister } from './entities/cash_registers.entity';

@Injectable()
export class CashRegisterService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(CashRegister)
    private readonly repo: Repository<CashRegister>,

    @InjectRepository(CashMovement)
    private readonly cashMovementRepo: Repository<CashMovement>,
  ) {}

  /**
   * Création prochaine session
   * CLOSED par défaut
   */
  async createSession(salonId: number, openingBalance = 0) {
    const cash = this.repo.create({
      salonId,

      openingBalance,

      totalCash: 0,

      totalCard: 0,

      totalMobileMoney: 0,

      cashout: 0,

      closingBalance: 0,

      status: 'CLOSED',
    });

    return this.repo.save(cash);
  }

  /**
   * Dernière session du salon
   */
  async getCurrentCashRegister(salonId: number) {
    return this.repo.findOne({
      where: {
        salonId,
      },

      order: {
        id: 'DESC',
      },
    });
  }

  /**
   * Ouverture manuelle
   */
  async openCashRegister(id: number) {
    const cash = await this.repo.findOne({
      where: {
        id,
      },
    });

    if (!cash) {
      throw new NotFoundException('Session caisse introuvable');
    }

    if (cash.status === 'OPEN') {
      throw new ConflictException('Caisse déjà ouverte');
    }

    cash.status = 'OPEN';

    cash.openedAt = new Date();

    return this.repo.save(cash);
  }

  /**
   * Résumé caisse
   */
  async getSummary(id: number) {
    const cash = await this.repo.findOne({
      where: {
        id,
      },
    });

    if (!cash) {
      throw new NotFoundException('Caisse introuvable');
    }

    const movements = await this.cashMovementRepo.find({
      where: {
        cashRegister: {
          id,
        },
      },
    });

    const sum = (list: CashMovement[]) =>
      list.reduce((total, m) => total + Number(m.amount), 0);

    const salesCash = movements.filter(
      (m) => m.type === CashMovementType.SALE_CASH,
    );

    const salesCard = movements.filter(
      (m) => m.type === CashMovementType.SALE_CARD,
    );

    const salesMobile = movements.filter(
      (m) => m.type === CashMovementType.SALE_MOBILE,
    );

    const cashIn = movements.filter(
      (m) =>
        m.direction === CashMovementDirection.IN &&
        m.type !== CashMovementType.SALE_CASH &&
        m.type !== CashMovementType.SALE_CARD &&
        m.type !== CashMovementType.SALE_MOBILE,
    );

    const cashOut = movements.filter(
      (m) => m.direction === CashMovementDirection.OUT,
    );

    const soldeTheorique =
      Number(cash.openingBalance ?? 0) +
      sum(salesCash) +
      sum(cashIn) -
      sum(cashOut);

    return {
      ...cash,

      soldeTheorique,

      totalEncaissement: sum(salesCash) + sum(salesCard) + sum(salesMobile),

      kpi: {
        espece: {
          montant: sum(salesCash),
          transactions: salesCash.length,
        },

        carte: {
          montant: sum(salesCard),
          transactions: salesCard.length,
        },

        mobileMoney: {
          montant: sum(salesMobile),
          transactions: salesMobile.length,
        },

        entree: {
          montant: sum(cashIn),
          transactions: cashIn.length,
        },

        sortie: {
          montant: sum(cashOut),
          transactions: cashOut.length,
        },

        totalTransactions: movements.length,
      },
    };
  }

  /**
   * Fermeture + préparation prochaine session
   */
  async closeCashRegister(id: number, countedBalance?: number) {
    const cash = await this.repo.findOne({
      where: {
        id,
      },
    });

    if (!cash) {
      throw new NotFoundException('Caisse introuvable');
    }

    if (cash.status !== 'OPEN') {
      throw new ConflictException('Caisse non ouverte');
    }

    const summary = await this.getSummary(id);

    const theorique = summary.soldeTheorique;

    const finalBalance = countedBalance ?? theorique;

    cash.closingBalance = finalBalance;

    cash.status = 'CLOSED';

    cash.closedAt = new Date();

    await this.repo.save(cash);

    /**
     * Préparation session suivante
     * PAS de mouvement OPENING
     */
    const nextCash = this.repo.create({
      salonId: cash.salonId,

      openingBalance: finalBalance,

      totalCash: 0,

      totalCard: 0,

      totalMobileMoney: 0,

      cashout: 0,

      closingBalance: 0,

      status: 'CLOSED',
    });

    await this.repo.save(nextCash);

    return {
      cash,

      nextCash,

      theorique,

      countedBalance: finalBalance,

      ecart: finalBalance - theorique,
    };
  }

  async findAll(salonId: number, page = 1, limit = 10) {
    const [data, total] = await this.repo.findAndCount({
      where: {
        salonId,
      },

      order: {
        id: 'DESC',
      },

      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getHistoryDetail(id: number) {
    const cash = await this.repo.findOne({
      where: {
        id,
      },
    });

    if (!cash) {
      throw new NotFoundException('Session introuvable');
    }

    const movements = await this.cashMovementRepo.find({
      where: {
        cashRegister: {
          id,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });

    const sum = (items: CashMovement[]) =>
      items.reduce((total, m) => total + Number(m.amount), 0);

    const ventes = movements.filter((m) =>
      [
        CashMovementType.SALE_CASH,
        CashMovementType.SALE_CARD,
        CashMovementType.SALE_MOBILE,
      ].includes(m.type),
    );

    const theorique =
      Number(cash.openingBalance) +
      sum(movements.filter((m) => m.direction === CashMovementDirection.IN)) -
      sum(movements.filter((m) => m.direction === CashMovementDirection.OUT));

    return {
      session: cash,

      resume: {
        fondInitial: Number(cash.openingBalance),

        soldeTheorique: theorique,

        soldeReel: Number(cash.closingBalance ?? 0),

        ecart: Number(cash.closingBalance ?? 0) - theorique,

        totalVentes: ventes.length,

        montantVentes: sum(ventes),
      },

      kpi: {
        espece: {
          montant: sum(
            movements.filter((m) => m.type === CashMovementType.SALE_CASH),
          ),

          transactions: movements.filter(
            (m) => m.type === CashMovementType.SALE_CASH,
          ).length,
        },

        mobile: {
          montant: sum(
            movements.filter((m) => m.type === CashMovementType.SALE_MOBILE),
          ),

          transactions: movements.filter(
            (m) => m.type === CashMovementType.SALE_MOBILE,
          ).length,
        },

        carte: {
          montant: sum(
            movements.filter((m) => m.type === CashMovementType.SALE_CARD),
          ),

          transactions: movements.filter(
            (m) => m.type === CashMovementType.SALE_CARD,
          ).length,
        },

        entree: {
          montant: sum(
            movements.filter((m) => m.direction === CashMovementDirection.IN),
          ),
        },

        sortie: {
          montant: sum(
            movements.filter((m) => m.direction === CashMovementDirection.OUT),
          ),
        },
      },

      mouvements: movements,
    };
  }
}
