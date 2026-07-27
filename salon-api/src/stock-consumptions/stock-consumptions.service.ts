import { Injectable, BadRequestException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository, DataSource } from 'typeorm';

import { StockConsumption } from './entities/stock-consumption.entity';

import { StockConsumptionItem } from './entities/stock-consumption-item.entity';
import { ProduitUnite } from 'src/produits/entities/produit_unites.entity';
import {
  StockMovement,
  StockMovementType,
} from 'src/stocks/entities/stock-movements.entity';
import { CreateStockConsumptionDto } from './dto/create-stock-consumption.dto';
@Injectable()
export class StockConsumptionService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(StockConsumption)
    private readonly repo: Repository<StockConsumption>,

    @InjectRepository(ProduitUnite)
    private readonly produitRepo: Repository<ProduitUnite>,

    @InjectRepository(StockMovement)
    private readonly movementRepo: Repository<StockMovement>,
  ) {}

  async create(dto: CreateStockConsumptionDto) {
    return this.dataSource.transaction(async (manager) => {
      let numero = `CONS-${new Date()
        .toISOString()
        .slice(0, 10)
        .replaceAll('-', '')}-${Date.now().toString().slice(-4)}`;

      const consumption = manager.create(StockConsumption, {
        numero,
        salonId: dto.salonId,
        motif: dto.motif,
      });

      await manager.save(consumption);

      for (const item of dto.items) {
        const produit = await manager.findOne(ProduitUnite, {
          where: {
            id: item.produitUniteId,
          },
        });

        if (!produit) {
          throw new BadRequestException('Produit introuvable');
        }

        if (Number(produit.stock) < item.quantite) {
          throw new BadRequestException(`Stock insuffisant ${produit.nom}`);
        }

        produit.stock = Number(produit.stock) - Number(item.quantite);

        await manager.save(produit);

        const detail = manager.create(StockConsumptionItem, {
          consumption,
          produitUnite: produit,
          quantite: item.quantite,
        });

        await manager.save(detail);

        // mouvement stock
        await manager.save(StockMovement, {
          produitUnite: produit,
          type: StockMovementType.OUT,
          quantity: item.quantite,
          reference: `CONSO-${produit.code}`,
          note: `CONSOMMATION_INTERNE`,
        });
      }

      return consumption;
    });
  }

  async findAll(page = 1, limit = 10, search = '') {
    const qb = this.repo
      .createQueryBuilder('sc')
      .leftJoinAndSelect('sc.items', 'items')
      .leftJoinAndSelect('items.produitUnite', 'produitUnite')
      .leftJoinAndSelect('produitUnite.produit', 'produit');

    if (search.trim()) {
      qb.where(
        `
      sc.numero LIKE :search
      OR sc.motif LIKE :search
      OR produit.nom LIKE :search
      OR produitUnite.nom LIKE :search
      `,
        {
          search: `%${search}%`,
        },
      );
    }

    qb.orderBy('sc.createdAt', 'DESC');
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
}
