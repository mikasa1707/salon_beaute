import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Vente } from './entities/vente.entity';
import { CreateVenteDto } from './dto/create-vente.dto';
import { UpdateVenteDto } from './dto/update-vente.dto';

@Injectable()
export class VentesService {
  constructor(
    @InjectRepository(Vente)
    private readonly repo: Repository<Vente>,
  ) {}

  async create(createDto: CreateVenteDto) {
    const _data = this.repo.create(createDto);
    return await this.repo.save(_data);
  }

  async findAll() {
    return await this.repo.find();
  }

  async findOne(id: number) {
    const _data = await this.repo.findOne({
      where: { id },
    });

    if (!_data) {
      throw new NotFoundException(`Vente ${id} introuvable`);
    }
    return _data;
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
}
