import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { ProduitUnite } from 'src/produits/entities/produit_unites.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';

import {
  StockMovement,
  StockMovementType,
} from './entities/stock-movements.entity';

import { VenteProduit } from 'src/vente-produits/entities/vente-produit.entity';
import { Vente } from 'src/ventes/entities/vente.entity';
import { StockMovementFilterDto } from './dto/stock-movement-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStockEntryDto } from './dto/create-stock-entry.dto';
import { AuditLogService } from 'src/audit-log/audit-log.service';
import { TransferPrestationProduitDto } from 'src/prestations_produits/dto/transfer-prestation-produit.dto';

@Injectable()
export class StockConsumptionService {
  constructor(
    @InjectRepository(StockMovement)
    private readonly repo: Repository<StockMovement>,

    @InjectRepository(ProduitUnite)
    private readonly produitUniteRepo: Repository<ProduitUnite>,

    private readonly dataSource: DataSource,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(manager: EntityManager, data: Partial<StockMovement>) {
    return manager.save(StockMovement, data);
  }

  /**
   * Déduction stock après vente
   */
  async decreaseFromItems(
    manager: EntityManager,
    venteId: number,
    items: Partial<VenteProduit>[],
  ) {
    for (const item of items) {
      console.log('ITEM RECU STOCK', {
        label: item.label,
        produitUniteId: item?.id,
        quantite: item.quantite,
      });
      // Pas de produit = prestation
      if (!item.produitUnite?.id) {
        continue;
      }

      const produitUniteId = Number(item.produitUnite.id);

      const produitUnite = await manager.findOne(ProduitUnite, {
        where: {
          id: produitUniteId,
        },

        // relations: {
        //   produit: true,
        // },

        lock: {
          mode: 'pessimistic_write',
        },
      });
      console.log(produitUniteId);
      console.log(produitUnite);

      if (!produitUnite) {
        throw new NotFoundException(
          `Produit unité ${produitUniteId} introuvable`,
        );
      }

      const quantite = Number(item.quantite);

      if (produitUnite.stock < quantite) {
        throw new ConflictException(`Stock insuffisant ${produitUnite.nom}`);
      }

      produitUnite.stock = Number(produitUnite.stock) - quantite;

      await manager.save(ProduitUnite, produitUnite);

      const vente = await manager.findOne(Vente, {
        where: {
          id: venteId,
        },
      });

      if (!vente) {
        throw new NotFoundException('Vente introuvable');
      }

      await this.create(manager, {
        produitUnite,
        type: StockMovementType.OUT,
        quantite,
        reference: `VENTE-${venteId}`,
        note: item.label,
        vente: vente,
      });
    }
  }

  async increase(
    manager: EntityManager,
    produitUnite: ProduitUnite,
    quantite: number,
    reference: string,
    note?: string,
  ) {
    produitUnite.stock = Number(produitUnite.stock) + Number(quantite);

    await manager.save(ProduitUnite, produitUnite);

    return this.create(manager, {
      produitUnite,

      type: StockMovementType.IN,

      quantite,

      reference,

      note,
    });
  }

  async findAll(page = 1, limit = 10, search = '') {
    const qb = this.repo
      .createQueryBuilder('movement')
      .leftJoinAndSelect('movement.produitUnite', 'unite')
      .leftJoinAndSelect('unite.produit', 'produit')
      .orderBy('movement.created_at', 'DESC');

    if (search.trim()) {
      qb.andWhere(
        `
      produit.nom LIKE :search
      OR unite.nom LIKE :search
      OR unite.code LIKE :search
      OR movement.reference LIKE :search
      `,
        {
          search: `%${search}%`,
        },
      );
    }

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const mouvements = data.map((movement) => ({
      ...movement,
      hasLowStockUnit:
        Number(movement.produitUnite?.stock ?? 0) <=
        Number(movement.produitUnite?.stock_minimum ?? 0),
      stockActuel: Number(movement.produitUnite?.stock ?? 0),
      produitNom: movement.produitUnite?.produit?.nom,
      uniteNom: movement.produitUnite?.nom,
      code: movement.produitUnite?.code,
    }));

    return {
      data: mouvements,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createEntry(
    dto: CreateStockEntryDto,
    userId: number,
    username: string,
  ) {
    const qr = this.dataSource.createQueryRunner();

    await qr.connect();
    await qr.startTransaction();

    const manager = qr.manager;

    try {
      for (const item of dto.items) {
        const unite = await manager.findOne(ProduitUnite, {
          where: {
            id: item.produitUniteId,
          },
          relations: {
            produit: true,
          },
          lock: {
            mode: 'pessimistic_write',
          },
        });

        if (!unite) {
          throw new NotFoundException(
            `Produit unité ${item.produitUniteId} introuvable`,
          );
        }

        const avant = Number(unite.stock);

        unite.stock += Number(item.quantite);

        await manager.save(ProduitUnite, unite);

        await manager.save(StockMovement, {
          produitUnite: unite,

          type: StockMovementType.IN,

          quantite: item.quantite,

          reference: dto.reference,

          note: dto.note,

          stockAvant: avant,

          stockApres: unite.stock,
        });
      }

      await qr.commitTransaction();

      await this.auditLogService.log({
        action: 'STOCK_ENTRY',

        entity: 'STOCK',

        entityId: 0,

        userId,

        username,

        payload: {
          reference: dto.reference,
          note: dto.note,
          totalItems: dto.items.length,
        },
      });

      return {
        success: true,
        message: 'Entrée stock enregistrée',
      };
    } catch (e) {
      await qr.rollbackTransaction();

      throw e;
    } finally {
      await qr.release();
    }
  }

  async transfer(dto: TransferPrestationProduitDto) {
    const qr = this.dataSource.createQueryRunner();

    await qr.connect();
    await qr.startTransaction();

    const manager = qr.manager;

    try {
      const unite = await manager.findOne(ProduitUnite, {
        where: {
          id: dto.produitUniteId,
        },
        relations: {
          produit: true,
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!unite) {
        throw new NotFoundException('Produit unité introuvable');
      }

      if (unite.stock < dto.quantite) {
        throw new ConflictException(`Stock insuffisant ${unite.nom}`);
      }

      // =====================
      // DIMINUTION STOCK
      // =====================

      unite.stock -= dto.quantite;

      await manager.save(ProduitUnite, unite);

      // =====================
      // STOCK MOVEMENT
      // =====================
      // console.log(StockMovementType, unite)

      // await manager.save(StockMovement, {
      //   produitUnite: unite,
      //   type: StockMovementType.TRANSFERT,
      //   quantite: dto.quantite,
      //   reference: `TRANSFERT-${Date.now()}`,
      //   note: 'Transfert',
      // });

      await qr.commitTransaction();

      return {
        success: true,
        message: 'Transfert stock effectué',
      };
    } catch (error) {
      await qr.rollbackTransaction();
      throw error;
    } finally {
      await qr.release();
    }
  }
}
