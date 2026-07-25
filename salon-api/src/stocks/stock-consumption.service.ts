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
import { Prestation } from 'src/prestations/entities/prestation.entity';
import { PrestationProduit } from 'src/prestations_produits/entities/prestations-produits.entity';
import { PrestationProduitConsumption } from 'src/prestations/entities/prestation_produit_consumptions.entity';

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
  // async decreaseFromItems(
  //   manager: EntityManager,
  //   venteId: number,
  //   items: Partial<VenteProduit>[],
  // ) {
  //   for (const item of items) {
  //     console.log('ITEM RECU STOCK', {
  //       label: item.label,
  //       produitUniteId: item?.id,
  //       quantite: item.quantite,
  //     });
  //     // Pas de produit = prestation
  //     if (!item.produitUnite?.id) {
  //       continue;
  //     }

  //     const produitUniteId = Number(item.produitUnite.id);

  //     const produitUnite = await manager.findOne(ProduitUnite, {
  //       where: {
  //         id: produitUniteId,
  //       },

  //       // relations: {
  //       //   produit: true,
  //       // },

  //       lock: {
  //         mode: 'pessimistic_write',
  //       },
  //     });
  //     console.log(produitUniteId);
  //     console.log(produitUnite);

  //     if (!produitUnite) {
  //       throw new NotFoundException(
  //         `Produit unité ${produitUniteId} introuvable`,
  //       );
  //     }

  //     const quantite = Number(item.quantite);

  //     if (produitUnite.stock < quantite) {
  //       throw new ConflictException(`Stock insuffisant ${produitUnite.nom}`);
  //     }

  //     produitUnite.stock = Number(produitUnite.stock) - quantite;

  //     await manager.save(ProduitUnite, produitUnite);

  //     const vente = await manager.findOne(Vente, {
  //       where: {
  //         id: venteId,
  //       },
  //     });

  //     if (!vente) {
  //       throw new NotFoundException('Vente introuvable');
  //     }

  //     await this.create(manager, {
  //       produitUnite,
  //       type: StockMovementType.OUT,
  //       quantite,
  //       reference: `VENTE-${venteId}`,
  //       note: item.label,
  //       vente: vente,
  //     });
  //   }
  // }

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

  async findAll(dto: StockMovementFilterDto) {
    const { page = 1, limit = 10, search = '', produitUniteId } = dto;

    const qb = this.repo
      .createQueryBuilder('movement')
      .leftJoinAndSelect('movement.produitUnite', 'unites')
      .leftJoinAndSelect('unites.produit', 'produit')
      .orderBy('movement.created_at', 'DESC');

    // Filtre produit unité
    if (produitUniteId) {
      qb.andWhere('unites.id = :produitUniteId', {
        produitUniteId,
      });
    }

    // Recherche
    if (search.trim()) {
      qb.andWhere(
        `
        produit.nom LIKE :search
        OR unites.nom LIKE :search
        OR unites.code LIKE :search
        OR movement.reference LIKE :search
        OR movement.note LIKE :search
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

    return {
      data: data.map((movement) => ({
        ...movement,

        produitNom: movement.produitUnite?.produit?.nom ?? '',
        uniteNom: movement.produitUnite?.nom ?? '',
        code: movement.produitUnite?.code ?? '',
        stockActuel: Number(movement.produitUnite?.stock ?? 0),
        hasLowStockUnit:
          Number(movement.produitUnite?.stock ?? 0) <=
          Number(movement.produitUnite?.stock_minimum ?? 0),
      })),

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
        const unites = await manager.findOne(ProduitUnite, {
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

        if (!unites) {
          throw new NotFoundException(
            `Produit unité ${item.produitUniteId} introuvable`,
          );
        }

        const avant = Number(unites.stock);

        unites.stock += Number(item.quantite);

        await manager.save(ProduitUnite, unites);

        await manager.save(StockMovement, {
          produitUnite: unites,

          type: StockMovementType.IN,

          quantite: item.quantite,

          reference: dto.reference,

          note: dto.note,

          stockAvant: avant,

          stockApres: unites.stock,
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
      const unites = await manager.findOne(ProduitUnite, {
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

      if (!unites) {
        throw new NotFoundException('Produit unité introuvable');
      }

      if (unites.stock < dto.quantite) {
        throw new ConflictException(`Stock insuffisant ${unites.nom}`);
      }

      // =====================
      // DIMINUTION STOCK
      // =====================

      unites.stock -= dto.quantite;

      await manager.save(ProduitUnite, unites);

      // =====================
      // STOCK MOVEMENT
      // =====================
      // console.log(StockMovementType, unites)

      // await manager.save(StockMovement, {
      //   produitUnite: unites,
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

  // async restoreFromVente(manager: EntityManager, vente: Vente) {
  //   const produits = vente.produits ?? [];

  //   for (const item of produits) {
  //     // uniquement les produits physiques
  //     if (!item.produitUnite) {
  //       continue;
  //     }

  //     const unites = await manager.findOne(ProduitUnite, {
  //       where: {
  //         id: item.produitUnite.id,
  //       },
  //       lock: {
  //         mode: 'pessimistic_write',
  //       },
  //     });

  //     if (!unites) {
  //       throw new NotFoundException(
  //         `Produit unité ${item.produitUnite.id} introuvable`,
  //       );
  //     }

  //     // restitution stock
  //     unites.stock += Number(item.quantite);

  //     await manager.save(ProduitUnite, unites);

  //     // mouvement stock RESTAURATION
  //     await manager.save(StockMovement, {
  //       produitUnite: unites,

  //       type: StockMovementType.SALE_CANCEL,

  //       quantite: item.quantite,

  //       reference: `EDIT-RESTAURE-${vente.id}`,

  //       note: `Restauration stock avant modification vente ${vente.id}`,
  //     });
  //   }
  // }

  async decreaseFromItems(
    manager: EntityManager,
    venteId: number,
    items: Partial<VenteProduit>[],
  ) {
    const vente = await manager.findOneBy(Vente, {
      id: venteId,
    });

    if (!vente) {
      throw new NotFoundException('Vente introuvable');
    }

    for (const item of items) {
      if (item.produitUnite) {
        await this.consumeProduitUnite(manager, vente, item);
      }

      if (item.prestation) {
        await this.consumePrestation(manager, vente, item);
      }
    }
  }

  private async consumeProduitUnite(
    manager: EntityManager,
    vente: Vente,
    item: Partial<VenteProduit>,
  ) {
    const unites = await manager.findOne(ProduitUnite, {
      where: {
        id: item.produitUnite!.id,
      },
      lock: {
        mode: 'pessimistic_write',
      },
    });

    if (!unites) {
      throw new NotFoundException();
    }

    const qty = Number(item.quantite);

    if (unites.stock < qty) {
      throw new ConflictException(`Stock insuffisant ${unites.nom}`);
    }

    unites.stock -= qty;

    await manager.save(unites);

    await manager.save(StockMovement, {
      produitUnite: unites,
      type: StockMovementType.OUT,
      quantite: qty,
      vente,
      reference: `VENTE-${vente.id}`,
      note: item.label,
    });
  }

  private async consumePrestation(
    manager: EntityManager,
    vente: Vente,
    venteProduit: Partial<VenteProduit>,
  ) {
    // const consommations = venteProduit.consomationsPrestation ?? [];

    // for (const consommation of consommations) {
    //   const produitPrestation = await manager.findOne(PrestationProduit, {
    //     where: {
    //       id: consommation.produitPrestation.id,
    //     },

    //     lock: {
    //       mode: 'pessimistic_write',
    //     },
    //   });

    //   if (!produitPrestation) {
    //     throw new NotFoundException('Produit prestation introuvable');
    //   }

    //   const quantite = Number(consommation.quantite);

    //   if (Number(produitPrestation.stock) < quantite) {
    //     throw new ConflictException(
    //       `Stock insuffisant ${produitPrestation.nom}`,
    //     );
    //   }

    //   const stockAvant = Number(produitPrestation.stock);

    //   produitPrestation.stock = stockAvant - quantite;

    //   await manager.save(PrestationProduit, produitPrestation);

    //   await manager.save(PrestationProduitConsumption, {
    //     vente,

    //     venteProduit,

    //     produitPrestation,

    //     quantite,

    //     action: 'CONSUME',
    //   });
    // }
  }

  private async restoreProduit(
    manager: EntityManager,
    item: VenteProduit,
    vente: Vente,
  ) {
    const unites = await manager.findOne(ProduitUnite, {
      where: {
        id: item.produitUnite?.id,
      },
      lock: {
        mode: 'pessimistic_write',
      },
    });

    if (!unites) {
      throw new NotFoundException();
    }
    const avant = Number(unites.stock);
    unites.stock = avant + Number(item.quantite);
    await manager.save(ProduitUnite, unites);
    await manager.save(StockMovement, {
      produitUnite: unites,

      type: StockMovementType.SALE_CANCEL,
      quantite: item.quantite,
      stockAvant: avant,
      stockApres: unites.stock,
      vente,
      reference: `EDIT-RESTAURE-${vente.id}`,
      note: `Restauration ${item.label}`,
    });
  }

  private async restorePrestation(
    manager: EntityManager,
    venteProduit: VenteProduit,
    vente: Vente,
  ) {
    const consommations = await manager.find(PrestationProduitConsumption, {
      where: {
        vente: {
          id: vente.id,
        },
        action: 'CONSUME',
      },

      relations: {
        produitPrestation: {
          unites: true,
        },
      },
    });

    for (const consommation of consommations) {
      const unites = await manager.findOne(ProduitUnite, {
        where: {
          id: consommation.produitPrestation.unites.id,
        },

        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!unites) {
        throw new NotFoundException('Produit unité introuvable');
      }

      const stockAvant = Number(unites.stock);

      unites.stock = stockAvant + Number(consommation.quantite);

      await manager.save(ProduitUnite, unites);

      /**
       * Historique restauration
       */

      await manager.save(PrestationProduitConsumption, {
        vente,
        reservation: vente.reservation ?? undefined,
        produitPrestation: consommation.produitPrestation,
        quantite: consommation.quantite,
        action: 'RESTORE',
      });
    }

    /**
     * Supprimer les anciennes consommations
     * après restauration
     */

    await manager.delete(PrestationProduitConsumption, {
      vente: {
        id: vente.id,
      },
      action: 'CONSUME',
    });
  }

  async restoreFromVente(manager: EntityManager, vente: Vente) {
    for (const item of vente.produits ?? []) {
      // =====================
      // PRODUIT DIRECT
      // =====================

      if (item.produitUnite) {
        await this.restoreProduit(manager, item, vente);
      }

      // =====================
      // PRESTATION
      // =====================

      if (item.prestation) {
        await this.restorePrestation(manager, item, vente);
      }
    }
  }
}
