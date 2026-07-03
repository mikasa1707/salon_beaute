import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { Facturation } from './entities/facturation.entity';
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

  async createFromReservation(reservationId: number): Promise<Facturation> {
    return this.dataSource.transaction(async (manager) => {
      // Chargement complet de la réservation
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

      // Vérifie qu'une facture n'existe pas déjà
      const existingFacturation = await manager.findOne(Facturation, {
        where: {
          reservation: {
            id: reservationId,
          },
        },
      });

      if (existingFacturation) {
        throw new ConflictException(
          'Une facture existe déjà pour cette réservation',
        );
      }

      let total = 0;

      const items = reservation.prestations.map((ligne) => {
        const lineTotal = Number(ligne.prix) * Number(ligne.quantite);

        total += lineTotal;

        return manager.create(FacturationItem, {
          label: ligne.prestation.nom,
          prix: ligne.prix,
          quantite: ligne.quantite,
          duree: ligne.duree,
        });
      });

      const facturation = manager.create(Facturation, {
        client: reservation.client,
        reservation,
        total,
        statut: 'UNPAID',
      });

      const savedFacturation = await manager.save(Facturation, facturation);

      items.forEach((item) => {
        item.facturation = savedFacturation;
      });

      await manager.save(FacturationItem, items);

      return savedFacturation;
    });
  }

  async lockFacture(manager: EntityManager, id: number) {
    return manager.findOne(Facturation, {
      where: { id },
      lock: { mode: 'pessimistic_write' },
      relations: {
        items: { produitUnite: true },
        client: true,
        reservation: true,
      },
    });
  }
}
