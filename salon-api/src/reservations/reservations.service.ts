import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto, } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation, ReservationOrigine, ReservationStatut } from './entities/reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Prestation } from 'src/prestations/entities/prestation.entity';
import { ReservationPrestation } from './entities/reservation-prestation.entity';
import { FacturationsService } from 'src/facturations/facturations.service';
import { ReservationPersonnel } from './entities/reservation-personnel.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly repo: Repository<Reservation>,
    @InjectRepository(Prestation)
    private readonly prestationRepo: Repository<Prestation>,
    @InjectRepository(ReservationPrestation)
    private readonly reservationPrestationRepo: Repository<ReservationPrestation>,
    @InjectRepository(ReservationPersonnel)
    private readonly reservationPersonnelRepo: Repository<ReservationPersonnel>,

    private readonly facturationService: FacturationsService,
  ) { }

  async create(createDto: CreateReservationDto) {
    const _data = this.repo.create(createDto);
    return await this.repo.save(_data);
  }

  async findAll() {
    return await this.repo.find({
      relations: {
        client: true,
        prestations: {
          prestation: true,
        },
      },
    });
  }

  async findOne(id: number) {
    const _data = await this.repo.findOne({
      where: { id },
      relations: {
        client: true,
        prestations: {
          prestation: true,
        },
      },
    });

    if (!_data) {
      throw new NotFoundException(`Marque ${id} introuvable`);
    }
    return _data;
  }

  async update(id: number, updateDto: UpdateReservationDto) {
    const _data = await this.repo.preload({
      id,
      ...updateDto,
    });

    if (!_data) {
      throw new NotFoundException(`Marque ${id} introuvable`);
    }

    return await this.repo.save(_data);
  }

  async remove(id: number) {
    const _data = await this.findOne(id);
    return await this.repo.remove(_data);
  }

  calculateEndTime(startTime: Date, totalDurationMinutes: number): Date {
    const end = new Date(startTime);
    end.setMinutes(end.getMinutes() + totalDurationMinutes);
    return end;
  }

  async checkAvailability(
    personnelIds: number[],
    startTime: Date,
    endTime: Date,
  ): Promise<any> {
    const conflicts = await this.repo
      .createQueryBuilder('r')
      .innerJoin('r.personnels', 'rp')
      .innerJoin('rp.personnel', 'p')
      .where('p.id IN (:...personnelIds)', {
        personnelIds,
      })
      .andWhere('r.statut != :cancelled', {
        cancelled: ReservationStatut.ANNULEE,
      })
      .andWhere(
        `
      r.date_debut < :endTime
      AND r.date_fin_prevue > :startTime
      `,
        {
          startTime,
          endTime,
        },
      );
    return conflicts;
  }

  async createReservation(dto: CreateReservationDto) {
    const {
      client_id,
      personnel_ids,
      date_debut,
      prestations,
      origine,
      statut,
    }: CreateReservationDto = dto;
    const numero = await this.generateNumero();

    // 1. Charger prestations DB
    const prestationsDb = await this.prestationRepo.find({
      where: {
        id: In(prestations.map((p) => p.prestation_id)),
      },
    });

    // 2. Build snapshot + calculs
    let totalDuree = 0;
    let totalPrix = 0;

    const reservationPrestations = prestations.map((p) => {
      const prestation = prestationsDb.find((pr) => pr.id === p.prestation_id);

      if (!prestation) {
        throw new NotFoundException(
          `Prestation ${p.prestation_id} introuvable`,
        );
      }

      const duree = prestation.duree;
      const prix = prestation.prix;

      totalDuree += duree * (p.quantite ?? 1);
      totalPrix += prix * (p.quantite ?? 1);

      return {
        prestation: { id: prestation.id },
        prix,
        duree,
        quantite: p.quantite ?? 1,
      };
    });

    // 3. Calcul date_fin
    const date_fin = this.calculateEndTime(date_debut, totalDuree);

    // 4. Check disponibilité
    const available = await this.checkAvailability(
      personnel_ids,
      date_debut,
      date_fin,
    );

    if (!available) {
      throw new ConflictException('Créneau indisponible pour ce personnel');
    }

    // 5. Création réservation (IMPORTANT: relations, pas *_id)
    const reservation = await this.repo.save({
      numero,
      client: { id: client_id },
      personnels: personnel_ids.map((id) => ({
        id,
      })),
      date_debut,
      date_fin,
      total_prix: totalPrix, // ✅ AJOUT
      total_duree: totalDuree, // (si tu l’as aussi)
      origine: origine ?? ReservationOrigine.RENDEZ_VOUS,
      statut: statut ?? ReservationStatut.EN_ATTENTE,
    });

    // 6. Insert pivot (ReservationPrestation)
    await this.reservationPrestationRepo.save(
      reservationPrestations.map((rp) =>
        this.reservationPrestationRepo.create({
          reservation: { id: reservation.id },
          prestation: rp.prestation,
          prix: rp.prix,
          duree: rp.duree,
          quantite: rp.quantite,
        }),
      ),
    );

    await this.reservationPersonnelRepo.save(
      personnel_ids.map((id) =>
        this.reservationPersonnelRepo.create({
          reservation: { id: reservation.id },
          personnel: { id },
        }),
      ),
    );

    // 7. Return full reservation
    return this.findOne(reservation.id);
  }

  private async generateNumero(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.repo.count();
    const numero = String(count + 1).padStart(6, '0');
    return `RES-${year}-${numero}`;
  }

  async updateReservation(id: number, dto: UpdateReservationDto) {
    const reservation = await this.repo.findOne({
      where: { id },
      relations: {
        prestations: true,
        personnels: {
          personnel: true,
        },
        client: true,
      },
    });

    if (!reservation) {
      throw new NotFoundException(`Réservation ${id} introuvable`);
    }

    const { date_debut, personnel_ids, prestations, statut, notes } = dto;

    // 1. Valeurs actuelles
    const newDateDebut = date_debut ?? reservation.date_debut;

    const newPersonnelIds =
      personnel_ids ?? reservation.personnels.map((rp) => rp.personnel.id);

    // 2. Recalcul prestations
    let totalDuree = 0;
    let totalPrix = 0;

    let reservationPrestations = reservation.prestations;

    if (prestations && prestations.length > 0) {
      const prestationsDb = await this.prestationRepo.find({
        where: {
          id: In(prestations.map((p) => p.prestation_id)),
        },
      });

      reservationPrestations = this.reservationPrestationRepo.create(
        prestations.map((p) => {
          const prestation = prestationsDb.find(
            (pr) => pr.id === p.prestation_id,
          );

          if (!prestation) {
            throw new NotFoundException(
              `Prestation ${p.prestation_id} introuvable`,
            );
          }

          const quantite = p.quantite ?? 1;

          totalDuree += prestation.duree * quantite;
          totalPrix += prestation.prix * quantite;

          return {
            reservation: { id },
            prestation: {
              id: prestation.id,
            },
            prix: prestation.prix,
            duree: prestation.duree,
            quantite,
          };
        }),
      );
    } else {
      reservation.prestations.forEach((p) => {
        totalDuree += p.duree * p.quantite;
        totalPrix += p.prix * p.quantite;
      });
    }

    // 3. Calcul fin
    const newDateFin = this.calculateEndTime(newDateDebut, totalDuree);

    // 4. Vérification disponibilité multi personnel

    const conflicts = await this.repo
      .createQueryBuilder('r')
      .innerJoin('r.personnels', 'rp')
      .innerJoin('rp.personnel', 'p')
      .where('p.id IN (:...personnelIds)', {
        personnelIds: newPersonnelIds,
      })
      .andWhere('r.id != :id', {
        id,
      })
      .andWhere('r.statut != :annule', {
        annule: ReservationStatut.ANNULEE,
      })
      .andWhere(
        `
      r.date_debut < :dateFin
      AND r.date_fin_prevue > :dateDebut
      `,
        {
          dateDebut: newDateDebut,
          dateFin: newDateFin,
        },
      )
      .getCount();

    if (conflicts > 0) {
      throw new ConflictException(
        'Créneau indisponible pour un des personnels',
      );
    }

    // 5. Update réservation

    reservation.date_debut = newDateDebut;
    reservation.date_fin_prevue = newDateFin;

    reservation.total_prix = totalPrix;
    reservation.total_duree = totalDuree;

    if (statut) {
      reservation.statut = statut;
    }

    if (notes !== undefined) {
      reservation.notes = notes;
    }

    await this.repo.save(reservation);

    // 6. Mise à jour personnels

    if (personnel_ids) {
      await this.reservationPersonnelRepo.delete({
        reservation: {
          id,
        },
      });

      await this.reservationPersonnelRepo.save(
        newPersonnelIds.map((personnelId) => ({
          reservation: {
            id,
          },
          personnel: {
            id: personnelId,
          },
        })),
      );
    }

    // 7. Mise à jour prestations

    if (prestations && prestations.length > 0) {
      await this.reservationPrestationRepo.delete({
        reservation: {
          id,
        },
      });

      await this.reservationPrestationRepo.save(
        reservationPrestations.map((rp) => ({
          reservation: {
            id,
          },
          prestation: rp.prestation,
          prix: rp.prix,
          duree: rp.duree,
          quantite: rp.quantite,
        })),
      );
    }
    return this.findOne(id);
  }

  async changeStatus(id: number, newStatus: ReservationStatut) {
    const reservation = await this.repo.findOne({
      where: { id },
      relations: { prestations: true, personnels: true, client: true },
    });

    if (!reservation) {
      throw new NotFoundException(`Réservation ${id} introuvable`);
    }

    const current = reservation.statut;

    const allowedTransitions: Record<ReservationStatut, ReservationStatut[]> = {
      EN_ATTENTE: [
        ReservationStatut.CONFIRMEE,
        ReservationStatut.ANNULEE,
        ReservationStatut.ARRIVEE,
      ],
      CONFIRMEE: [
        ReservationStatut.EN_COURS,
        ReservationStatut.ANNULEE,
        ReservationStatut.ABSENT,
      ],
      [ReservationStatut.ARRIVEE]: [
        ReservationStatut.EN_COURS,
        ReservationStatut.ANNULEE,
        ReservationStatut.TERMINEE,
      ],
      EN_COURS: [ReservationStatut.TERMINEE, ReservationStatut.ANNULEE],
      TERMINEE: [],
      ANNULEE: [],
      ABSENT: [],
    };

    if (!allowedTransitions[current].includes(newStatus)) {
      throw new ConflictException(
        `Transition invalide : ${current} → ${newStatus}`,
      );
    }

    if (newStatus === ReservationStatut.TERMINEE) {
      await this.facturationService.createFromReservation(reservation.id);
    }

    reservation.statut = newStatus;

    await this.repo.save(reservation);

    return this.findOne(id);
  }
}
