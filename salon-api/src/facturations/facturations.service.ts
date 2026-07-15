import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

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

      const facture = manager.create(Facturation, {
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
          label: item.prestation.nom,
          quantite,
          prix_unitaire: prixUnitaire,
          total: lineTotal,
        });
      });

      await manager.save(FacturationItem, items);

      savedFacture.total = total;

      return manager.save(Facturation, savedFacture);
    });
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
      },
    });

    if (!facture) {
      throw new NotFoundException('Facture introuvable');
    }

    return facture;
  }

  async findOne(id: number) {
    return this.dataSource.transaction(async (manager) => {
      const facture = await manager.findOne(Facturation, {
        where: { id },
        relations: {
          items: true,
          client: true,
          reservation: true,
        },
      });

      if (!facture) {
        throw new NotFoundException('Facture introuvable');
      }

      return facture;
    });
  }
}
