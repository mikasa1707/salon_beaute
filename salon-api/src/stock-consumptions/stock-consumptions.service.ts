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

  /**
   * Création consommation
   * Sortie stock
   */
  async create(dto: CreateStockConsumptionDto) {
    return this.dataSource.transaction(async (manager) => {
      const numero = `CONS-${new Date()
        .toISOString()
        .slice(0, 10)
        .replaceAll('-', '')}-${Date.now().toString().slice(-4)}`;

      const consumption = manager.create(StockConsumption, {
        numero,

        salonId: 1,

        motif: dto.motif,

        actif: true,
      });

      await manager.save(consumption);

      for (const item of dto.items) {
        const produit = await manager.findOne(ProduitUnite, {
          where: {
            id: item.produitUniteId,
          },
        });

        if (!produit) {
          throw new BadRequestException('Produit unité introuvable');
        }

        if (Number(produit.stock) < Number(item.quantite)) {
          throw new BadRequestException(`Stock insuffisant : ${produit.nom}`);
        }

        // diminution stock

        produit.stock = Number(produit.stock) - Number(item.quantite);

        await manager.save(produit);

        // détail consommation

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

          quantite: item.quantite,

          reference: `CONSO-${numero}`,

          note: 'CONSOMMATION_INTERNE',
        });
      }

      return manager.findOne(StockConsumption, {
        where: {
          id: consumption.id,
        },

        relations: {
          items: {
            produitUnite: {
              produit: true,
            },
          },
        },
      });
    });
  }

  /**
   * Liste historique
   */
  async findAll(page = 1, limit = 10, search = '') {
    const qb = this.repo
      .createQueryBuilder('sc')
      .leftJoinAndSelect('sc.items', 'items')
      .leftJoinAndSelect('items.produitUnite', 'produitUnite')
      .leftJoinAndSelect('produitUnite.produit', 'produit')
      .where('sc.actif = :actif', {
        actif: true,
      });

    if (search.trim()) {
      qb.andWhere(
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

  /**
   * Detail consommation
   */
  async findOne(id: number) {
    return this.repo.findOne({
      where: {
        id,

        actif: false,
      },

      relations: {
        items: {
          produitUnite: {
            produit: true,
          },
        },
      },
    });
  }

  /**
   * Modification
   * Restore ancien stock
   * Applique nouveau stock
   */
  async update(id: number, dto: CreateStockConsumptionDto) {
    return this.dataSource.transaction(async (manager) => {
      const consumption = await manager.findOne(StockConsumption, {
        where: { id },
        relations: {
          items: {
            produitUnite: true,
          },
        },
      });

      if (!consumption) {
        throw new BadRequestException('Consommation introuvable');
      }

      //
      // 1. Restaurer le stock
      //
      for (const oldItem of consumption.items) {
        oldItem.produitUnite.stock += Number(oldItem.quantite);
        await manager.save(oldItem.produitUnite);
      }

      //
      // 2. Supprimer les anciens détails
      //
      await manager.remove(consumption.items);

      //
      // 3. Vider le tableau mémoire
      //
      consumption.items = [];

      //
      // 4. Modifier le motif
      //
      consumption.motif = dto.motif;

      //
      // 5. Ajouter les nouveaux détails
      //
      for (const item of dto.items) {
        const produit = await manager.findOne(ProduitUnite, {
          where: {
            id: item.produitUniteId,
          },
        });

        if (!produit) {
          throw new BadRequestException('Produit introuvable');
        }

        if (produit.stock < item.quantite) {
          throw new BadRequestException(
            `Stock insuffisant pour ${produit.nom}`,
          );
        }

        produit.stock -= item.quantite;
        await manager.save(produit);

        const detail = manager.create(StockConsumptionItem, {
          consumption,
          produitUnite: produit,
          quantite: item.quantite,
        });

        await manager.save(detail);

        consumption.items.push(detail);

        await manager.save(StockMovement, {
          produitUnite: produit,
          type: StockMovementType.OUT,
          quantite: item.quantite,
          reference: `CONSO-${consumption.numero}`,
          note: 'MODIFICATION_CONSOMMATION',
        });
      }

      return manager.save(consumption);
    });
  }

  /**
   * Archivage
   */
  async actif(id: number) {
    const consumption = await this.repo.findOneBy({
      id,
    });

    if (!consumption) {
      throw new BadRequestException('Consommation introuvable');
    }

    consumption.actif = false;

    return this.repo.save(consumption);
  }
}
