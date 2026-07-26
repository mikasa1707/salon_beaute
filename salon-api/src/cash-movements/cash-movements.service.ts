import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CashRegister } from 'src/cash-register/entities/cash_registers.entity';
import { Repository } from 'typeorm';
import { CreateCashMovementDto } from './dto/create-cash-movement.dto';
import {
  CashMovement,
  CashMovementDirection,
} from './entities/cash-movement.entity';

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
    } else {
      cash.totalCash = Number(cash.totalCash) - Number(dto.amount);

      cash.cashout = Number(cash.cashout) + Number(dto.amount);
    }

    await this.cashRepo.save(cash);

    return saved;
  }

  // Pattern ancien dev : findAll pagination recherche

  async findAll(page = 1, limit = 10, search = '') {
    const qb = this.repo
      .createQueryBuilder('movement')
      .leftJoinAndSelect('movement.cashRegister', 'cash');

    if (search.trim()) {
      qb.andWhere(
        `
        movement.label LIKE :search
        OR movement.reference LIKE :search
        OR movement.type LIKE :search
        `,
        {
          search: `%${search}%`,
        },
      );
    }

    qb.orderBy('movement.createdAt', 'DESC');

    qb.skip((page - 1) * limit);

    qb.take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Historique d'une caisse précise

  async findByCashRegister(
    cashRegisterId: number,
    page = 1,
    limit = 10,
    search = '',
  ) {
    const qb = this.repo
      .createQueryBuilder('movement')
      .where('movement.cash_register_id = :cashRegisterId', {
        cashRegisterId,
      });

    if (search.trim()) {
      qb.andWhere(
        `
        movement.label LIKE :search
        OR movement.reference LIKE :search
        OR movement.type LIKE :search
        `,
        {
          search: `%${search}%`,
        },
      );
    }

    qb.orderBy('movement.createdAt', 'DESC');
    qb.skip((page - 1) * limit);
    qb.take(limit);

    const [data, total] = await qb.getManyAndCount();
    const _data = data.map((d) => ({
      ...d,
      type_move: `${this.typeLabel(d.type)}`,
    }));

    return {
      data: _data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  typeLabel(type: any) {
    const labels: any = {
      OPENING: 'Ouverture caisse',
      SALE_CASH: 'Vente espèce',
      SALE_CARD: 'Vente carte',
      SALE_MOBILE: 'Vente mobile',
      OTHER_INCOME: 'Autre entrée',
      CASH_OUT: 'Retrait',
      EXPENSE: 'Dépense',
      REFUND: 'Remboursement',
      SALARY_ADVANCE: 'Avance salaire',
    };

    return labels[type] ?? type;
  }

  async findOne(id: number) {
    const movement = await this.repo.findOne({
      where: {
        id,
      },
      relations: {
        cashRegister: true,
      },
    });

    if (!movement) {
      throw new NotFoundException('Mouvement introuvable');
    }

    return movement;
  }

  async findCurrent(page = 1, limit = 10, search = '') {
    const cash = await this.cashRepo.findOne({
      where: {
        salonId: 1,
        status: 'OPEN',
      },
    });

    if (!cash) {
      throw new NotFoundException('Aucune caisse ouverte');
    }

    return this.findByCashRegister(cash.id, page, limit, search);
  }
}
