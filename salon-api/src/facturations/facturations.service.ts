import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, ILike, Repository } from 'typeorm';

import { Facturation, FacturationStatus } from './entities/facturation.entity';
import { FacturationItem } from './entities/facturation-item.entity';
import { Reservation } from '../reservations/entities/reservation.entity';

@Injectable()
export class FacturationsService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Facturation)
    private readonly facturationRepo: Repository<Facturation>,

    @InjectRepository(FacturationItem)
    private readonly itemRepo: Repository<FacturationItem>,
  ) {}

  // =========================
  // CREATE FACTURE FROM RESERVATION (SAFE)
  // =========================
  async createFromReservation(reservationId: number) {
    return this.dataSource.transaction(async (manager) => {
      const reservation = await manager.findOne(Reservation, {
        where: { id: reservationId },
        relations: {
          client: true,
          prestations: {
            prestation: true,
          },
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!reservation) {
        throw new NotFoundException('Réservation introuvable');
      }

      const existing = await manager.findOne(Facturation, {
        where: {
          reservation: {
            id: reservationId,
          },
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (existing) {
        throw new ConflictException(
          'Facture déjà existante pour cette réservation',
        );
      }

      let total = 0;

      const numero = await this.generateNumeroFacture(manager);

      const facture = manager.create(Facturation, {
        numero,
        client: reservation.client,
        reservation,
        total: 0,
        status: FacturationStatus.UNPAID,
        isLocked: false,
      });

      const savedFacture = await manager.save(Facturation, facture);
      const items = reservation.prestations.map((item) => {
        const prixUnitaire = Number(item.prix);
        const quantite = Number(item.quantite);
        const lineTotal = prixUnitaire * quantite;
        total += lineTotal;
        return manager.create(FacturationItem, {
          facturation: savedFacture,
          prestation: item.prestation,
          prestationId: item.prestation.id,
          label: item.prestation.nom,
          nomComplet: item.prestation.nom,
          quantite,
          prix: prixUnitaire,
          prix_unitaire: prixUnitaire,
          total: lineTotal,
        });
      });
      await manager.save(FacturationItem, items);
      savedFacture.total = total;
      return manager.save(Facturation, savedFacture);
    });
  }

  private async generateNumeroFacture(manager: EntityManager): Promise<string> {
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, '');
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    const count = await manager
      .createQueryBuilder(Facturation, 'facture')
      .where('facture.created_at BETWEEN :start AND :end', {
        start,
        end,
      })
      .getCount();
    const sequence = String(count + 1).padStart(4, '0');
    return `FAC-${date}-${sequence}`;
  }

  // =========================
  // SAFE LOCK HELPER (OK)
  // =========================
  async lockFacture(manager: EntityManager, id: number) {
    const facture = await manager.findOne(Facturation, {
      where: { id },
      lock: { mode: 'pessimistic_write' },
      relations: {
        items: true,
        client: true,
        reservation: true,
        vente: true,
      },
    });

    if (!facture) {
      throw new NotFoundException('Facture introuvable');
    }

    return facture;
  }

  // =========================
  // FIND ONE
  // =========================
  async findOne(id: number) {
    const facture = await this.facturationRepo.findOne({
      where: { id },
      relations: {
        client: true,
        reservation: true,
        items: { prestation: true , produitUnite: true },
        vente: true,
      },
    });

    if (!facture) {
      throw new NotFoundException('Facture introuvable');
    }

    return {
      ...facture,
      genre: facture.client?.genre,
      nom:
        (facture.client?.genre || '') +
        ' ' +
        (facture.client?.nom || '') +
        ' ' +
        facture.client?.prenom,
      prenom: facture.client?.prenom,
      date_facture: new Date(facture.created_at).toLocaleDateString('fr-FR'),
    };
  }

  // =========================
  // FIND ALL
  // =========================
  async findAll(page = 1, limit = 10, search = '') {
    const [data, total] = await this.facturationRepo.findAndCount({
      where: [
        {
          client: {
            nom: ILike(`%${search}%`),
          },
        },
        {
          client: {
            prenom: ILike(`%${search}%`),
          },
        },
        {
          reservation: {
            numero: ILike(`%${search}%`),
          },
        },
      ],
      relations: {
        client: true,
        reservation: true,
        items: { prestation: true , produitUnite: true },
        vente: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        id: 'DESC',
      },
    });

    return {
      data: data.map((facture) => ({
        ...facture,
        genre: facture.client?.genre,
        nom:
          (facture.client?.genre || '') +
          ' ' +
          (facture.client?.nom || '') +
          ' ' +
          facture.client?.prenom,
        prenom: facture.client?.prenom,
        date_facture: new Date(facture.created_at).toLocaleDateString('fr-FR'),
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
