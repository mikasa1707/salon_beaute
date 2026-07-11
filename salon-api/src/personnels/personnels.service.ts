import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonnelDto } from './dto/create-personnel.dto';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { Personnel } from './entities/personnel.entity';
import { Prestation } from 'src/prestations/entities/prestation.entity';

@Injectable()
export class PersonnelsService {
  constructor(
    @InjectRepository(Personnel)
    private readonly repo: Repository<Personnel>,
    @InjectRepository(Prestation)
    private readonly prestationRepository: Repository<Prestation>,
  ) {}

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
}
