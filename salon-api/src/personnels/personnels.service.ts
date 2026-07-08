import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonnelDto } from './dto/create-personnel.dto';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Personnel } from './entities/personnel.entity';

@Injectable()
export class PersonnelsService {
  constructor(
    @InjectRepository(Personnel)
    private readonly repo: Repository<Personnel>,
  ) {}

  async create(createDto: CreatePersonnelDto) {
    const _data = this.repo.create(createDto);
    return await this.repo.save(_data);
  }

  async findAll(page = 1, limit = 10, search = '') {
    const [data, total] = await this.repo.findAndCount({
      where: [
        { nom: ILike(`%${search}%`), actif: true },
        { prenom: ILike(`%${search}%`), actif: true },
        { telephone: ILike(`%${search}%`), actif: true },
        { email: ILike(`%${search}%`), actif: true },
      ],

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
      relations: { reservations: true },
    });

    if (!_data) {
      throw new NotFoundException(`Personnel ${id} introuvable`);
    }
    return _data;
  }

  async update(id: number, updateDto: UpdatePersonnelDto) {
    const _data = await this.repo.preload({
      id,
      ...updateDto,
    });

    if (!_data) {
      throw new NotFoundException(`Personnel ${id} introuvable`);
    }

    return await this.repo.save(_data);
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
