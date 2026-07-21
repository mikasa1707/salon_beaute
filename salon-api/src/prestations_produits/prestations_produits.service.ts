import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';

import { PrestationProduit } from './entities/prestations-produits.entity';
import { ProduitUnite } from 'src/produits/entities/produit_unites.entity';
import { Produit } from 'src/produits/entities/produit.entity';
import { PrestationRecette } from '../prestations-recettes/entities/prestations-recette.entity';
import { TransferPrestationProduitDto } from './dto/transfer-prestation-produit.dto';
import { UpdatePrestationProduitDto } from './dto/update-prestation-produit.dto';
import { StockMovement, StockMovementType } from 'src/stocks/entities/stock-movements.entity';
import { StockConsumptionService } from 'src/stocks/stock-consumption.service';

@Injectable()
export class PrestationProduitsService {
  constructor(
    @InjectRepository(PrestationProduit)
    private readonly repo: Repository<PrestationProduit>,

    @InjectRepository(ProduitUnite)
    private readonly uniteRepo: Repository<ProduitUnite>,

    @InjectRepository(Produit)
    private readonly produitRepo: Repository<Produit>,

    @InjectRepository(PrestationRecette)
    private readonly recetteRepo: Repository<PrestationRecette>,

    private readonly stockConsumptionService: StockConsumptionService,
    private dataSource: DataSource,
  ) {}

  /**
   * Liste du stock disponible pour prestations
   */
  // async findAll() {
  //   return this.repo.find({
  //     relations: {
  //       produit: true,
  //       unite: true,
  //     },
  //   });
  // }
  async findAll(page = 1, limit = 10, search = '') {
    const where = search
      ? [
          { produit: { nom: ILike(`%${search}%`) } },
          { unite: { nom: ILike(`%${search}%`) } },
        ]
      : {};

    const [data, total] = await this.repo.findAndCount({
      where,
      relations: {
        produit: {
          uniteConsommation: true,
        },
        unite: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        id: 'ASC',
      },
    });

    return {
      data: data.map((item) => ({
        ...item,
        produitId: item.produit.id,
        uniteMesure: item.produit.uniteConsommation,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  /**
   * Détail produit prestation
   */
  async findOne(id: number) {
    const data = await this.repo.findOne({
      where: {
        id,
      },
      relations: {
        produit: {
          uniteConsommation: true,
        },
        unite: true,
      },
    });
    if (!data) {
      throw new NotFoundException('Produit prestation introuvable');
    }
    return data;
  }
  /**
   * Stock disponible d'un produit prestation
   */
  async findByPrestation(prestationId: number) {
    return this.repo.find({
      where: {
        prestation: {
          id: prestationId,
        },
      },
      relations: {
        produit: true,
        unite: true,
      },
    });
  }
  /**
   * Transfert :
   *
   * ProduitUnite
   *      |
   *      v
   * PrestationProduit
   *
   */
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
        throw new BadRequestException('Stock insuffisant');
      }

      // ===================================
      // STOCK PHYSIQUE + STOCK MOVEMENT
      // ===================================

      // await this.stockConsumptionService.transfer(dto);

      // ===================================
      // CONVERSION EN UNITE CONSOMMATION
      // ===================================

      const quantiteConvertie = dto.quantite * Number(unite.conversion);

      // Recherche stock prestation existant

      const existant = await manager.findOne(PrestationProduit, {
        where: {
          produit: {
            id: unite.produit.id,
          },
          unite: {
            id: unite.id,
          },
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (existant) {
        existant.quantite = Number(existant.quantite) + quantiteConvertie;

        await manager.save(PrestationProduit, existant);
      } else {
        const data = manager.create(PrestationProduit, {
          produit: {
            id: unite.produit.id,
          },

          unite: {
            id: unite.id,
          },

          quantite: quantiteConvertie,
        });

        await manager.save(PrestationProduit, data);
      }

      await manager.save(StockMovement, {
        produitUnite: unite,
        type: StockMovementType.TRANSFERT,
        quantite: dto.quantite,
        reference: `TRANSFERT-${Date.now()}`,
        note: 'Transfert pour prestation',
      });

      await qr.commitTransaction();

      return {
        success: true,
        message: 'Transfert effectué',
      };
    } catch (error) {
      await qr.rollbackTransaction();
      throw error;
    } finally {
      await qr.release();
    }
  }
  /**
   * Récupérer recette d'une prestation
   *
   * Utilisé dans modal TERMINEE
   */
  async getRecette(prestationId: number) {
    return this.recetteRepo.find({
      where: {
        prestation: {
          id: prestationId,
        },
      },
      relations: {
        produit: true,
      },
    });
  }
  /**
   * Consommation réelle
   *
   * Appelé quand réservation TERMINEE
   */
  async consume(
    produits: {
      prestationProduitId: number;
      quantite: number;
    }[],
  ) {
    const consommation: PrestationProduit[] = [];
    for (const item of produits) {
      const prestationProduit = await this.repo.findOne({
        where: {
          id: item.prestationProduitId,
        },

        relations: {
          produit: true,
          unite: true,
        },
      });
      if (!prestationProduit) {
        throw new NotFoundException('Produit prestation introuvable');
      }
      if (prestationProduit.quantite < item.quantite) {
        throw new BadRequestException(
          `Stock insuffisant pour ${prestationProduit.produit.nom}`,
        );
      }
      prestationProduit.quantite -= item.quantite;
      consommation.push(await this.repo.save(prestationProduit));
    }
    return consommation;
  }

  /**
   * Suppression stock prestation
   */
  async remove(id: number) {
    const data = await this.findOne(id);
    return this.repo.remove(data);
  }

  async update(id: number, dto: UpdatePrestationProduitDto) {
    const data = await this.findOne(id);
    data.quantite = dto.quantite;
    return this.repo.save(data);
  }
}
