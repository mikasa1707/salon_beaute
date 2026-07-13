import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonnelDto } from './dto/create-personnel.dto';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { Personnel } from './entities/personnel.entity';
import { Prestation } from 'src/prestations/entities/prestation.entity';
import { CheckAvailablePersonnelDto } from './dto/available-personnel.dto';
import { Reservation, ReservationStatut } from 'src/reservations/entities/reservation.entity';

@Injectable()
export class PersonnelsService {
  constructor(
    @InjectRepository(Personnel)
    private readonly repo: Repository<Personnel>,
    @InjectRepository(Prestation)
    private readonly prestationRepository: Repository<Prestation>,
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
  ) { }

  async create(createDto: CreatePersonnelDto) {
    const { prestationIds, ...data } = createDto;

    const personnel = this.repo.create(data);

    if (prestationIds?.length) {
      personnel.prestations = await this.prestationRepository.findBy({
        id: In(prestationIds),
      });
    }

    return await this.repo.save(personnel);
  }

  async findAll(page = 1, limit = 10, search = '') {
    const [data, total] = await this.repo.findAndCount({
      where: [
        { nom: ILike(`%${search}%`), actif: true },
        { prenom: ILike(`%${search}%`), actif: true },
        { telephone: ILike(`%${search}%`), actif: true },
        { email: ILike(`%${search}%`), actif: true },
      ],
      relations: { reservations: true, prestations: true },

      skip: (page - 1) * limit,
      take: limit,
      order: {
        nom: 'ASC',
      },
    });
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const _data = await this.repo.findOne({
      where: { id },
      relations: { reservations: true, prestations: true },
    });

    if (!_data) {
      throw new NotFoundException(`Personnel ${id} introuvable`);
    }
    return _data;
  }

  async update(id: number, updateDto: UpdatePersonnelDto) {
    const { prestationIds, ...data } = updateDto;

    const personnel = await this.repo.findOne({
      where: { id },
      relations: { reservations: true, prestations: true },
    });

    if (!personnel) {
      throw new NotFoundException('Personnel introuvable');
    }

    Object.assign(personnel, data);

    if (prestationIds !== undefined) {
      personnel.prestations = prestationIds.length
        ? await this.prestationRepository.findBy({
          id: In(prestationIds),
        })
        : [];
    }

    return await this.repo.save(personnel);
  }

  // async remove(id: number) {
  //   const _data = await this.findOne(id);
  //   return await this.repo.remove(_data);
  // }

  async remove(id: number) {
    const personnel = await this.findOne(id);

    if (!personnel) {
      throw new NotFoundException('Personnel introuvable');
    }
    await this.repo.update(id, { actif: false });

    return {
      message: 'Personnel supprimé',
    };
  }

  async getAvailablePersonnel(dto: CheckAvailablePersonnelDto) {
    const { date, heure, prestationIds } = dto;

    if (!prestationIds?.length) {
      return [];
    }
    const personnels = await this.repo.find({
      where: {
        actif: true,
      },
      relations: {
        prestations: true,
        reservations: true,
      },
      order: {
        nom: 'ASC',
      },
    });

    const prestations = await this.prestationRepository.find({
      where: {
        id: In(prestationIds),
      },
    });

    const dureeTotal = prestations.reduce(
      (total, prestation) => total + prestation.duree,
      0,
    );


    const startDate = new Date(`${date}T${heure}:00`);
    const endDate = new Date(startDate);
    endDate.setMinutes(
      endDate.getMinutes() + dureeTotal,
    );

    const personnelDisponibles = await Promise.all(
      personnels
        .filter((personnel) => {
          const personnelPrestationIds = (personnel.prestations ?? []).map(
            (prestation) => prestation.id,
          );

          return prestationIds.some((id) =>
            personnelPrestationIds.includes(id),
          );
        })
        .map(async (personnel) => {

          const conflicts = await this.getPersonnelConflicts(
            personnel.id,
            startDate,
            endDate,
          );

          return {
            id: personnel.id,
            nom: personnel.nom,
            prenom: personnel.prenom,
            prestations: personnel.prestations
              .filter((prestation) =>
                prestationIds.includes(prestation.id),
              )
              .map((prestation) => ({
                id: prestation.id,
                nom: prestation.nom,
                duree: prestation.duree,
                prix: prestation.prix,
              })),
            disponible: conflicts.length === 0,
            conflicts,
          };
        }),
    );
    return personnelDisponibles;
  }

  private async getPersonnelConflicts(
    personnelId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const reservations = await this.reservationRepo
      .createQueryBuilder('reservation')
      .innerJoin('reservation.personnels', 'personnel')
      .leftJoin('reservation.client', 'client')
      .where('personnel.id = :personnelId', { personnelId })
      .andWhere('reservation.statut != :statut', {
        statut: ReservationStatut.ANNULEE,
      })
      .select([
        'reservation.id',
        'reservation.date_debut',
        'reservation.total_duree',
        'client.nom',
        'client.prenom',
      ])
      .getMany();
      
    const conflicts = reservations
      .map((reservation) => {
        const debut = new Date(reservation.date_debut);

        const fin = new Date(debut);
        fin.setMinutes(
          fin.getMinutes() + (reservation.total_duree ?? 0),
        );

        return {
          reservationId: reservation.id,
          client: reservation.client
            ? `${reservation.client.prenom} ${reservation.client.nom}`
            : 'Client inconnu',
          debut,
          fin,
        };
      })
      .filter((reservation) => {
        return (
          reservation.debut < endDate &&
          reservation.fin > startDate
        );
      });

    return conflicts;
  }
}
