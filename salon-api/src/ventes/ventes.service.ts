import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Vente } from './entities/vente.entity';
import { CreateVenteDto } from './dto/create-vente.dto';
import { UpdateVenteDto } from './dto/update-vente.dto';
import { Facturation } from 'src/facturations/entities/facturation.entity';
import { ProduitUnite } from 'src/produits/entities/produit_unites.entity';
import { VenteProduit } from 'src/vente-produits/entities/vente-produit.entity';
import {
  StockMovement,
  StockMovementType,
} from 'src/stocks/entities/stock-movements.entity';
import { PrestationProduit } from 'src/prestations_produits/entities/prestations-produits.entity';

@Injectable()
export class VentesService {
  constructor(
    @InjectRepository(Vente)
    private readonly repo: Repository<Vente>,

    @InjectRepository(Facturation)
    private readonly factureRepo: Repository<Facturation>,

    @InjectRepository(ProduitUnite)
    private readonly uniteRepo: Repository<ProduitUnite>,

    @InjectRepository(VenteProduit)
    private readonly venteProduitRepo: Repository<VenteProduit>,

    private dataSource: DataSource,
  ) {}

  async create(createDto: CreateVenteDto) {
    const _data = this.repo.create(createDto);
    return await this.repo.save(_data);
  }

  async findAll(page = 1, limit = 10, search = '', statutPaiement = '') {
    const qb = this.repo

      .createQueryBuilder('vente')

      .leftJoinAndSelect('vente.facturation', 'facturation')
      .leftJoinAndSelect('facturation.reservation', 'reservation')
      .leftJoinAndSelect('reservation.client', 'client')
      .leftJoinAndSelect('vente.produits', 'ligne')
      .leftJoinAndSelect('ligne.produitUnite', 'produitUnite')
      .leftJoinAndSelect('ligne.prestation', 'prestation')
      .leftJoinAndSelect('vente.paiements', 'paiement')

      .orderBy('vente.created_at', 'DESC');

    qb.andWhere('vente.isCancelled = :isCancelled', {
      isCancelled: false,
    });

    if (search.trim()) {
      qb.andWhere(
        `(vente.numero LIKE :search
      OR client.nom LIKE :search
      OR client.prenom LIKE :search)`,
        {
          search: `%${search}%`,
        },
      );
    }

    const all = await qb.getMany();

    const mapped = all.map((v) => {
      // const montantPaye =
      //   v.paiements?.reduce((sum, p) => sum + Number(p.montant), 0) ?? 0;
      const montantPaye = v.montantPaye;
      const total = Number(v.total);

      return {
        ...v,
        numero: this.generateNumeroVente(v.id, v.created_at),
        client: v.facturation?.reservation?.client ?? null,
        nomComplet: v.facturation?.reservation?.client.prenom
          ? `${v.facturation?.reservation?.client.genre} ${v.facturation?.reservation?.client.prenom} ${v.facturation?.reservation?.client.nom}`
          : 'Cllient au comptoir ' + this.generateClientCode(v.id),
        montantPaye,
        reste: +total - +montantPaye,
        statutPaiement:
          +montantPaye >= +total
            ? 'PAYE'
            : +montantPaye > 0
              ? 'PARTIEL'
              : 'NON_PAYE',
      };
    });

    const filtered = statutPaiement
      ? mapped.filter((v) => v.statutPaiement === statutPaiement)
      : mapped;

    const total = filtered.length;
    const data = filtered.slice((page - 1) * limit, page * limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private generateClientCode(id: number): string {
    return id.toString().padStart(6, '0');
  }

  private generateNumeroVente(id: number, _date: Date): string {
    const date =
      _date.getFullYear().toString().slice(2) +
      String(_date.getMonth() + 1).padStart(2, '0') +
      String(_date.getDate()).padStart(2, '0');

    const prefix = `V${date}`;

    return `${prefix}-${id.toString().padStart(4, '0')}`;
  }

  async findOne(id: number) {
    const vente = await this.repo.findOne({
      where: {
        id,
      },
      relations: {
        facturation: {
          reservation: {
            client: true,
          },
        },
        produits: {
          produitUnite: {
            produit: true,
          },
          prestation: true,
        },

        paiements: true,
      },
    });

    if (!vente) {
      throw new NotFoundException('Vente introuvable');
    }

    const montantPaye =
      vente.paiements?.reduce((sum, p) => sum + Number(p.montant), 0) ?? 0;

    return {
      ...vente,
      client: vente.facturation?.reservation?.client ?? null,
      montantPaye,
      reste: Number(vente.total) - montantPaye,
      statutPaiement:
        montantPaye >= Number(vente.total)
          ? 'PAYE'
          : montantPaye > 0
            ? 'PARTIEL'
            : 'NON_PAYE',
    };
  }

  async update(id: number, updateDto: UpdateVenteDto) {
    const _data = await this.repo.preload({
      id,
      ...updateDto,
    });

    if (!_data) {
      throw new NotFoundException(`Vente ${id} introuvable`);
    }

    return await this.repo.save(_data);
  }

  async remove(id: number) {
    const _data = await this.findOne(id);
    return await this.repo.remove(_data);
  }

  async cancelVente(venteId: number) {
    const qr = this.dataSource.createQueryRunner();

    await qr.connect();
    await qr.startTransaction();

    try {
      const manager = qr.manager;

      const vente = await manager.findOne(Vente, {
        where: { id: venteId },
        relations: {
          produits: {
            produitUnite: true,
            prestation: true,
          },
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!vente) {
        throw new NotFoundException('Vente introuvable');
      }

      if (vente.isCancelled) {
        throw new ConflictException('Cette vente est déjà annulée');
      }

      for (const item of vente.produits) {
        /**
         * ==========================================
         * CAS 1 : Produit vendu directement
         * ==========================================
         */
        if (item.produitUnite) {
          const unite = await manager.findOne(ProduitUnite, {
            where: {
              id: item.produitUnite.id,
            },
            lock: {
              mode: 'pessimistic_write',
            },
          });

          if (!unite) {
            throw new NotFoundException(
              `ProduitUnite ${item.produitUnite.id} introuvable`,
            );
          }

          unite.stock += item.quantite;

          await manager.save(unite);

          await manager.save(StockMovement, {
            produitUnite: unite,
            type: StockMovementType.SALE_CANCEL,
            quantite: item.quantite,
            reference: `ANNULATION-${this.generateNumeroVente(vente.id, vente.created_at)}`,
            note: `Annulation vente ${this.generateNumeroVente(vente.id, vente.created_at)}`,
          });
        }

        /**
         * ==========================================
         * CAS 2 : Produits consommés par prestation
         * ==========================================
         */
        if (item.prestation) {
          const prestationProduits = await manager.find(PrestationProduit, {
            where: {
              prestation: {
                id: item.prestation.id,
              },
            },
            relations: {
              produit: true,
            },
          });

          for (const pp of prestationProduits) {
            const unite = await manager.findOne(ProduitUnite, {
              where: {
                id: pp.produit.id,
              },
              lock: {
                mode: 'pessimistic_write',
              },
            });

            if (!unite) {
              throw new NotFoundException(
                `ProduitUnite ${pp.produit.id} introuvable`,
              );
            }

            const quantite = pp.quantite * item.quantite;

            unite.stock += quantite;

            await manager.save(unite);

            // await manager.save(StockMovement, {
            //   produitUnite: unite,
            //   type: StockMovementType.SALE_CANCEL,
            //   quantite,
            //   reference: `ANNULATION-${vente.numero}`,
            //   note: `Annulation prestation ${item.prestation.nom}`,
            // });
          }
        }
      }

      vente.isCancelled = true;
      vente.cancelledAt = new Date();

      await manager.save(vente);

      await qr.commitTransaction();

      return vente;
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }

  async updatePaiement(id: number, montant: number) {
    const vente = await this.repo.findOneBy({
      id,
    });

    if (!vente) {
      throw new NotFoundException('Vente introuvable');
    }

    vente.montantPaye = Number(vente.montantPaye) + Number(montant);

    if (vente.montantPaye > vente.total) {
      vente.montantPaye = vente.total;
    }

    return this.repo.save(vente);
  }
}
