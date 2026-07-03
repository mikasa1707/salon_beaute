import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation, ReservationStatut } from './entities/reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Prestation } from 'src/prestations/entities/prestation.entity';
import { ReservationPrestation } from './entities/reservation-prestation.entity';
import { Personnel } from 'src/personnels/entities/personnel.entity';
import { FacturationsService } from 'src/facturations/facturations.service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly repo: Repository<Reservation>,
    @InjectRepository(Prestation)
    private readonly prestationRepo: Repository<Prestation>,
    @InjectRepository(ReservationPrestation)
    private readonly reservationPrestationRepo: Repository<ReservationPrestation>,

    private readonly facturationService: FacturationsService,
  ) {}

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
    personnelId: number,
    startTime: Date,
    endTime: Date,
  ): Promise<boolean> {
    const conflicts = await this.repo
      .createQueryBuilder('r')
      .where('r.personnel_id = :personnelId', { personnelId })
      .andWhere('r.status != :cancelled', { cancelled: 'ANNULEE' })
      .andWhere(
        `(
        r.start_time < :endTime
        AND r.end_time > :startTime
      )`,
        { startTime, endTime },
      )
      .getCount();

    return conflicts === 0;
  }

  async createReservation(dto: CreateReservationDto) {
    const { client_id, personnel_id, date_debut, prestations } = dto;

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
      personnel_id,
      date_debut,
      date_fin,
    );

    if (!available) {
      throw new ConflictException('Créneau indisponible pour ce personnel');
    }

    // 5. Création réservation (IMPORTANT: relations, pas *_id)
    const reservation = await this.repo.save({
      client: { id: client_id },
      personnel: { id: personnel_id },
      date_debut,
      date_fin,
      statut: ReservationStatut.EN_ATTENTE,
      total_prix: totalPrix, // ✅ AJOUT
      total_duree: totalDuree, // (si tu l’as aussi)
    });

    // 6. Insert pivot (ReservationPrestation)
    await this.reservationPrestationRepo.save(
      reservationPrestations.map((rp) => ({
        reservation: { id: reservation.id },
        prestation: rp.prestation,
        prix: rp.prix,
        duree: rp.duree,
        quantite: rp.quantite,
      })),
    );

    // 7. Return full reservation
    return this.findOne(reservation.id);
  }

  async updateReservation(id: number, dto: UpdateReservationDto) {
    const reservation = await this.repo.findOne({
      where: { id },
      relations: { prestations: true, personnel: true, client: true },
    });

    if (!reservation) {
      throw new NotFoundException(`Réservation ${id} introuvable`);
    }

    const { date_debut, personnel_id, prestations, statut, notes } = dto;

    // 1. Utiliser anciennes valeurs si non modifiées
    const newDateDebut = date_debut ?? reservation.date_debut;
    const newPersonnelId = personnel_id ?? reservation.personnel.id;

    // 2. Recalcul prestations si fournies, sinon garder anciennes
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
            prestation: { id: prestation.id },
            prix: prestation.prix,
            duree: prestation.duree,
            quantite,
          };
        }),
      );
    } else {
      // garder ancien snapshot
      reservation.prestations.forEach((p) => {
        totalDuree += p.duree * p.quantite;
        totalPrix += p.prix * p.quantite;
      });
    }

    // 3. Calcul nouvelle fin
    const newDateFin = this.calculateEndTime(newDateDebut, totalDuree);

    // 4. CHECK DISPONIBILITÉ (IMPORTANT: exclure soi-même)
    const conflicts = await this.repo
      .createQueryBuilder('r')
      .where('r.personnel_id = :personnelId', {
        personnelId: newPersonnelId,
      })
      .andWhere('r.id != :id', { id })
      .andWhere('r.statut != :annule', { annule: 'ANNULEE' })
      .andWhere(
        `(
        r.date_debut < :dateFin
        AND r.date_fin > :dateDebut
      )`,
        {
          dateDebut: newDateDebut,
          dateFin: newDateFin,
        },
      )
      .getCount();

    if (conflicts > 0) {
      throw new ConflictException('Créneau indisponible');
    }

    // 5. UPDATE réservation
    reservation.date_debut = newDateDebut;
    reservation.date_fin = newDateFin;
    reservation.personnel = { id: newPersonnelId } as Personnel;
    reservation.total_prix = totalPrix;
    reservation.total_duree = totalDuree;

    if (statut) reservation.statut = statut;
    if (notes !== undefined) reservation.notes = notes;

    await this.repo.save(reservation);

    // 6. Si prestations modifiées → reset pivot
    if (prestations && prestations.length > 0) {
      await this.reservationPrestationRepo.delete({
        reservation: { id },
      });

      await this.reservationPrestationRepo.save(
        reservationPrestations.map((rp) => ({
          reservation: { id },
          prestation: rp.prestation,
          prix: rp.prix,
          duree: rp.duree,
          quantite: rp.quantite,
        })),
      );
    }

    // 7. Retour propre
    return this.findOne(id);
  }

  async changeStatus(id: number, newStatus: ReservationStatut) {
    const reservation = await this.repo.findOne({
      where: { id },
      relations: { prestations: true, personnel: true, client: true },
    });

    if (!reservation) {
      throw new NotFoundException(`Réservation ${id} introuvable`);
    }

    const current = reservation.statut;

    const allowedTransitions: Record<ReservationStatut, ReservationStatut[]> = {
      EN_ATTENTE: [ReservationStatut.CONFIRMEE, ReservationStatut.ANNULEE],
      CONFIRMEE: [
        ReservationStatut.EN_COURS,
        ReservationStatut.ANNULEE,
        ReservationStatut.ABSENT,
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
