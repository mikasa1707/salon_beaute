import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Brackets } from 'typeorm';

import { Inventaire } from './entities/inventaire.entity';
import { InventaireLigne } from './entities/inventaire.entity';

import { ProduitUnite } from '../produits/entities/produit_unites.entity';
import { CreateInventaireDto } from './dto/create-inventaire.dto';
import {
  StockMovement,
  StockMovementType,
} from 'src/stocks/entities/stock-movements.entity';

// import {
//   StockMovement,
//   StockMovementType,
// } from '../stocks/entities/stock-movements.entity';

@Injectable()
export class InventairesService {
  constructor(
    @InjectRepository(Inventaire)
    private readonly repo: Repository<Inventaire>,

    @InjectRepository(InventaireLigne)
    private readonly ligneRepo: Repository<InventaireLigne>,

    @InjectRepository(ProduitUnite)
    private readonly uniteRepo: Repository<ProduitUnite>,

    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateInventaireDto) {
    const qr = this.dataSource.createQueryRunner();

    await qr.connect();
    await qr.startTransaction();

    const numero = `INV-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '')}-${Date.now()}`;

    try {
      const manager = qr.manager;

      const inventaire = manager.create(Inventaire, {
        numero: numero,
        reference: dto.reference,
        note: dto.note,
      });

      const saved = await manager.save(Inventaire, inventaire);

      for (const item of dto.lignes) {
        const unite = await manager.findOne(ProduitUnite, {
          where: {
            id: item.produitUniteId,
          },
          lock: {
            mode: 'pessimistic_write',
          },
        });

        if (!unite) throw new NotFoundException('Produit unité introuvable');

        await manager.save(InventaireLigne, {
          inventaire: saved,
          produitUnite: unite,
          stockTheorique: unite.stock,
          stockReel: item.stockReel,
          ecart: Number(item.stockReel) - Number(unite.stock),
        });
      }

      await qr.commitTransaction();

      return saved;
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }

  async findAll(page = 1, limit = 10, search = '') {
    const qb = this.repo
      .createQueryBuilder('inventaire')
      .leftJoinAndSelect('inventaire.lignes', 'ligne')
      .leftJoinAndSelect('ligne.produitUnite', 'produitUnite')
      .leftJoinAndSelect('produitUnite.produit', 'produit')

      // uniquement les actifs
      .where('inventaire.actif = :actif', {
        actif: true,
      })

      .orderBy('inventaire.created_at', 'DESC');

    if (search.trim()) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('inventaire.numero LIKE :search')
            .orWhere('inventaire.reference LIKE :search')
            .orWhere('inventaire.note LIKE :search')
            .orWhere('produit.nom LIKE :search')
            .orWhere('produitUnite.code LIKE :search');
        }),
        {
          search: `%${search}%`,
        },
      );
    }

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const inventaires = data.map((inventaire) => {
      const lignes = inventaire.lignes ?? [];

      const nbLignesEcart = lignes.filter(
        (ligne) => Number(ligne.ecart) !== 0,
      ).length;

      const totalEcart = lignes.reduce(
        (sum, ligne) => sum + Number(ligne.ecart ?? 0),
        0,
      );

      return {
        ...inventaire,
        nbLignes: lignes.length,
        nbLignesEcart,
        totalEcart,
        hasEcart: nbLignesEcart > 0,
        statut: inventaire.valide ? 'VALIDE' : 'EN_COURS',
      };
    });

    return {
      data: inventaires,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const data = await this.repo.findOne({
      where: {
        id,
        actif: true,
      },

      relations: {
        lignes: {
          produitUnite: {
            produit: true,
          },
        },
      },
    });

    if (!data) {
      throw new NotFoundException('Inventaire introuvable');
    }

    const lignes = data.lignes ?? [];

    const totalEcart = lignes.reduce(
      (sum, ligne) => sum + Number(ligne.ecart ?? 0),
      0,
    );

    const nbLignesEcart = lignes.filter(
      (ligne) => Number(ligne.ecart ?? 0) !== 0,
    ).length;

    const surplus = lignes.filter(
      (ligne) => Number(ligne.ecart ?? 0) > 0,
    ).length;

    const manque = lignes.filter(
      (ligne) => Number(ligne.ecart ?? 0) < 0,
    ).length;

    return {
      ...data,
      nbLignes: lignes.length,
      nbLignesEcart,
      totalEcart,
      hasEcart: nbLignesEcart > 0,
      surplus,
      manque,
      statut: data.valide ? 'VALIDE' : 'EN_COURS',
    };
  }

  async validate(id: number) {
    const qr = this.dataSource.createQueryRunner();

    await qr.connect();
    await qr.startTransaction();
    const manager = qr.manager;

    try {
      const inventaire = await manager.findOne(Inventaire, {
        where: {
          id,
        },

        relations: {
          lignes: {
            produitUnite: true,
          },
        },

        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!inventaire) {
        throw new NotFoundException('Inventaire introuvable');
      }

      if (inventaire.valide) {
        throw new BadRequestException('Inventaire déjà validé');
      }

      for (const ligne of inventaire.lignes) {
        const unite = await manager.findOne(ProduitUnite, {
          where: {
            id: ligne.produitUnite.id,
          },

          lock: {
            mode: 'pessimistic_write',
          },
        });

        if (!unite) {
          throw new NotFoundException('Produit unité introuvable');
        }

        const ancienStock = Number(unite.stock);
        const nouveauStock = Number(ligne.stockReel);
        const ecart = nouveauStock - ancienStock;

        if (ecart !== 0) {
          unite.stock = nouveauStock;

          await manager.save(ProduitUnite, unite);

          await manager.save(StockMovement, {
            produitUnite: unite,
            type: StockMovementType.ADJUST,
            quantite: Math.abs(ecart),
            reference: inventaire.numero,
            note: `Ajustement inventaire ${inventaire.numero}`,
          });
        }
      }

      inventaire.valide = true;

      await manager.save(Inventaire, inventaire);

      await qr.commitTransaction();

      return {
        success: true,
        message: 'Inventaire validé',
      };
    } catch (error) {
      await qr.rollbackTransaction();

      throw error;
    } finally {
      await qr.release();
    }
  }

  async deactivate(id: number) {
    const inventaire = await this.repo.findOne({
      where: {
        id,
      },
    });

    if (!inventaire) {
      throw new NotFoundException('Inventaire introuvable');
    }

    if (inventaire.valide) {
      throw new BadRequestException(
        'Impossible de désactiver un inventaire validé',
      );
    }

    inventaire.actif = false;
    return this.repo.save(inventaire);
  }

  async update(id: number, dto: CreateInventaireDto) {
    const qr = this.dataSource.createQueryRunner();

    await qr.connect();
    await qr.startTransaction();

    const manager = qr.manager;

    try {
      const inventaire = await manager.findOne(Inventaire, {
        where: { id },
        relations: {
          lignes: {
            produitUnite: true,
          },
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!inventaire) {
        throw new NotFoundException('Inventaire introuvable');
      }

      if (inventaire.valide) {
        throw new BadRequestException(
          'Impossible de modifier un inventaire validé',
        );
      }

      inventaire.reference = dto.reference;
      inventaire.note = dto.note;

      const anciennesLignes = inventaire.lignes;
      const nouvellesLignes = dto.lignes;

      // Index des anciennes lignes
      const anciennesMap = new Map(
        anciennesLignes.map((l) => [l.produitUnite.id, l]),
      );

      // ==========================
      // AJOUT / MODIFICATION
      // ==========================

      for (const item of nouvellesLignes) {
        const unite = await manager.findOne(ProduitUnite, {
          where: {
            id: item.produitUniteId,
          },
        });

        if (!unite) {
          throw new NotFoundException(
            `Produit unité ${item.produitUniteId} introuvable`,
          );
        }

        const stockReel = Number(item.stockReel);
        const stockTheo = Number(unite.stock);
        const ecart = stockReel - stockTheo;

        const ligneExistante = anciennesMap.get(item.produitUniteId);

        if (ligneExistante) {
          ligneExistante.stockTheorique = stockTheo;
          ligneExistante.stockReel = stockReel;
          ligneExistante.ecart = ecart;

          await manager.save(InventaireLigne, ligneExistante);

          anciennesMap.delete(item.produitUniteId);
        } else {
          const ligne = manager.create(InventaireLigne, {
            inventaire,
            produitUnite: unite,
            stockTheorique: stockTheo,
            stockReel,
            ecart,
          });

          await manager.save(InventaireLigne, ligne);
        }
      }

      // ==========================
      // SUPPRESSION
      // ==========================

      for (const ligne of anciennesMap.values()) {
        await manager.remove(InventaireLigne, ligne);
      }

      // ==========================
      // RECALCUL
      // ==========================

      // inventaire.nbProduits = nouvellesLignes.length;
      // inventaire.nbEcarts = await manager.count(InventaireLigne, {
      //   where: {
      //     inventaire: {
      //       id: inventaire.id,
      //     },
      //   },
      // });

      await manager.save(Inventaire, inventaire);
      await qr.commitTransaction();

      return {
        success: true,
        message: 'Inventaire mis à jour',
      };
    } catch (error) {
      await qr.rollbackTransaction();
      throw error;
    } finally {
      await qr.release();
    }
  }
}
