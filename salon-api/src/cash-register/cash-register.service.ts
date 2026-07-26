import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CashMovement, CashMovementType, CashMovementDirection } from "src/cash-movements/entities/cash-movement.entity";
import { DataSource, Repository } from "typeorm";
import { CashRegister } from "./entities/cash_registers.entity";

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
   * CREATION SESSION CAISSE
   * Etat initial CLOSED
   */
  async createSession(salonId: number) {
    const cash = await this.repo.save({
      salonId,

      openingBalance: 0,

      totalCash: 0,

      totalCard: 0,

      totalMobileMoney: 0,

      cashout: 0,

      closingBalance: 0,

      status: 'CLOSED',
    });

    return cash;
  }

  /**
   * CAISSE OUVERTE
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
   * OUVRIR UNE SESSION EXISTANTE
   */
  async openCashRegister(id: number, openingBalance: number) {
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

    cash.openingBalance = openingBalance;

    cash.openedAt = new Date();

    await this.repo.save(cash);

    await this.cashMovementRepo.save({
      cashRegister: cash,

      type: CashMovementType.OPENING,

      direction: CashMovementDirection.IN,

      amount: openingBalance,

      label: 'Fond de caisse',

      reference: `OPEN-${cash.id}`,
    });

    return cash;
  }

  /**
   * DETAIL CAISSE
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
   * FERMETURE
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

    await this.repo.save(cash);

    return {
      cash,

      theorique,

      ecart: countedBalance ? Number(countedBalance) - theorique : 0,
    };
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
        id: 'DESC',
      },
    });
  }
}
