import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePrestationDto } from './dto/create-prestation.dto';
import { UpdatePrestationDto } from './dto/update-prestation.dto';
import { Prestation } from './entities/prestation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class PrestationsService {
  constructor(
    @InjectRepository(Prestation)
    private readonly repo: Repository<Prestation>,
  ) {}

  async create(createDto: CreatePrestationDto) {
    const _data = this.repo.create(createDto);
    return await this.repo.save(_data);
  }

  async findAll(page = 1, limit = 10, search = '') {
    const [data, total] = await this.repo.findAndCount({
      where: [{ nom: ILike(`%${search}%`), actif: true }],
      relations: { typePrestation: true },

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
      relations: { typePrestation: true, reservations: true },
    });

    if (!_data) {
      throw new NotFoundException(`Prestation ${id} introuvable`);
    }
    return _data;
  }

  async update(id: number, updateDto: UpdatePrestationDto) {
    const _data = await this.repo.preload({
      id,
      ...updateDto,
    });

    if (!_data) {
      throw new NotFoundException(`Prestation ${id} introuvable`);
    }

    return await this.repo.save(_data);
  }

  async remove(id: number) {
    const prestation = await this.findOne(id);

    if (!prestation) {
      throw new NotFoundException('Prestation introuvable');
    }
    await this.repo.update(id, { actif: false });

    return {
      message: 'Prestation supprimé',
    };
  }
}
